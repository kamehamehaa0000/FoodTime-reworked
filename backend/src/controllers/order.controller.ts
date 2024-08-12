import { Request, Response } from 'express'
import asyncHandler from '../utilities/AsyncHandler'
import ApiError from '../utilities/ErrorHandler'
import ApiResponse from '../utilities/ResponseHandler'
import { Order } from '../models/order.model'
import { Cart } from '../models/cart.model'
import Razorpay from 'razorpay'
import crypto from 'crypto'

interface AuthRequest extends Request {
  user?: { userId: string }
}
const razorKeyId = process.env.RAZORPAY_KEY_ID
  ? process.env.RAZORPAY_KEY_ID
  : ''
const razorSecret = process.env.RAZORPAY_KEY_SECRET
  ? process.env.RAZORPAY_KEY_SECRET
  : ''
const razorpay = new Razorpay({
  key_id: razorKeyId,
  key_secret: razorSecret,
})

const createOrder = asyncHandler(
  async (req: Request | AuthRequest, res: Response) => {
    let userId = (req as AuthRequest).user?.userId || ''
    const cart = await Cart.findOne({ user: userId }).populate('items.product')
    try {
      if (!cart) {
        throw new ApiError(404, 'Cart not found')
      }

      const totalPrice = cart.items.reduce((sum, item) => {
        const product = item.product as any
        const discount = product.offerPercentage || 0
        const discountedPrice = product.price * (1 - discount / 100)
        return sum + discountedPrice * item.quantity
      }, 0)
      const options = {
        amount: totalPrice * 100,
        currency: 'INR',
        receipt: `receipt_order_${new Date().getTime()}`,
        notes: {
          userId: userId.toString(),
        },
      }
      const { address, phoneNumber } = req.body
      const razorpayOrder = await razorpay.orders.create(options)

      const order = new Order({
        user: userId,
        items: cart.items,
        totalPrice,
        status: 'Pending',
        paymentIntentId: razorpayOrder.id,
        address: address,
        phoneNumber: phoneNumber,
      })

      await order.save()

      res.status(200).json(
        new ApiResponse(
          200,
          {
            order,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
          },
          'Order created successfully'
        )
      )
    } catch (error) {
      console.log(error)
      throw new ApiError(500, 'order creation failed')
    }
  }
)

const completeOrder = asyncHandler(
  async (req: Request | AuthRequest, res: Response) => {
    const { orderId, paymentId, signature } = req.body
    let userId = (req as AuthRequest).user?.userId || ''

    const order = await Order.findById(orderId)
    if (!order) {
      throw new ApiError(404, 'Order not found')
    }

    const body = order.paymentIntentId + '|' + paymentId
    const cart = await Cart.findOne({ user: userId }).populate('items.product')

    const hmac = crypto.createHmac('sha256', razorSecret)
    hmac.update(body)
    const expectedSignature = hmac.digest('hex')

    if (expectedSignature !== signature) {
      throw new ApiError(400, 'Payment verification failed')
    }

    order.status = 'Completed'
    if (cart) {
      cart.items = []
      await cart.save()
    }

    await order.save()

    res
      .status(200)
      .json(new ApiResponse(200, order, 'Order completed successfully'))
  }
)

const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const order = await Order.findById(id).populate('items.product')
  if (!order) {
    throw new ApiError(404, 'Order not found')
  }
  res
    .status(200)
    .json(new ApiResponse(200, order, 'Order fetched successfully'))
})

const getAllUserOrder = asyncHandler(
  async (req: AuthRequest | Request, res: Response) => {
    const userId = (req as AuthRequest).user?.userId
    if (!userId) {
      throw new ApiError(401, 'User not authenticated')
    }

    const orders = await Order.find({ user: userId }).populate('items.product')
    if (!orders.length) {
      throw new ApiError(404, 'No orders found for this user')
    }

    res
      .status(200)
      .json(new ApiResponse(200, orders, 'Orders fetched successfully'))
  }
)

const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await Order.find().populate('items.product')
  if (!orders.length) {
    throw new ApiError(404, 'No orders found')
  }
  res
    .status(200)
    .json(new ApiResponse(200, orders, 'Orders fetched successfully'))
})
export { createOrder, completeOrder, getOrder, getAllOrders, getAllUserOrder }
