import { Request, Response } from 'express'
import asyncHandler from '../utilities/AsyncHandler'
import ApiError from '../utilities/ErrorHandler'
import ApiResponse from '../utilities/ResponseHandler'
import { Cart } from '../models/cart.model'
import { Product } from '../models/product.model'

interface AuthRequest extends Request {
  user?: { userId: string }
}

const getCart = asyncHandler(
  async (req: Request | AuthRequest, res: Response) => {
    const userId = (req as AuthRequest).user?.userId
    const cart = await Cart.findOne({ user: userId }).populate('items.product')
    if (!cart) {
      return res.status(200).json(new ApiResponse(200, [], 'empty cart'))
    }
    if (cart?.items.length == 0) {
      // await cart.deleteOne({ user: userId })
      return res.status(200).json(new ApiResponse(200, [], 'empty cart'))
    }
    res
      .status(200)
      .json(new ApiResponse(200, cart, 'Cart fetched successfully'))
  }
)

const addToCart = asyncHandler(
  async (req: Request | AuthRequest, res: Response) => {
    try {
      const userId = (req as AuthRequest).user?.userId
      const { productId } = req.body
      const product = await Product.findById(productId)
      if (!product) {
        throw new ApiError(404, 'Product not found')
      }

      let cart = await Cart.findOne({ user: userId })
      if (!cart) {
        cart = new Cart({ user: userId, items: [] })
      }

      const cartItemIndex = cart.items.findIndex((item) =>
        item.product.equals(productId)
      )
      if (cartItemIndex > -1) {
        cart.items[cartItemIndex].quantity += 1
      } else {
        cart.items.push({ product: productId, quantity: 1 })
      }
      await cart.save()
      cart = await Cart.findOne({ user: userId }).populate('items.product')
      res.status(200).json(new ApiResponse(200, cart, 'Product added to cart'))
    } catch (error) {
      throw new ApiError(
        500,
        `Error adding product to cart: ${(error as Error).message}`
      )
    }
  }
)

const removeFromCart = asyncHandler(
  async (req: Request | AuthRequest, res: Response) => {
    try {
      const userId = (req as AuthRequest).user?.userId
      const { productId } = req.body

      if (!userId) {
        throw new ApiError(401, 'User not authenticated')
      }

      let cart = await Cart.findOne({ user: userId })
      if (!cart) {
        throw new ApiError(404, 'Cart not found')
      }

      const cartItemIndex = cart.items.findIndex((item) =>
        item.product.equals(productId)
      )

      if (cartItemIndex === -1) {
        throw new ApiError(404, 'Product not found in cart')
      }

      if (cart.items[cartItemIndex].quantity > 1) {
        cart.items[cartItemIndex].quantity -= 1
      } else {
        cart.items.splice(cartItemIndex, 1)
      }

      await cart.save()
      cart = await Cart.findOne({ user: userId }).populate('items.product')

      res
        .status(200)
        .json(new ApiResponse(200, cart, 'Product quantity updated in cart'))
    } catch (error) {
      throw new ApiError(
        500,
        `Error updating product in cart: ${(error as Error).message}`
      )
    }
  }
)
export { addToCart, removeFromCart, getCart }
