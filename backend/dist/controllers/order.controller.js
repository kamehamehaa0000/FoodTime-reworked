"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUserOrder = exports.getAllOrders = exports.getOrder = exports.completeOrder = exports.createOrder = void 0;
const AsyncHandler_1 = __importDefault(require("../utilities/AsyncHandler"));
const ErrorHandler_1 = __importDefault(require("../utilities/ErrorHandler"));
const ResponseHandler_1 = __importDefault(require("../utilities/ResponseHandler"));
const order_model_1 = require("../models/order.model");
const cart_model_1 = require("../models/cart.model");
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const razorKeyId = process.env.RAZORPAY_KEY_ID
    ? process.env.RAZORPAY_KEY_ID
    : '';
const razorSecret = process.env.RAZORPAY_KEY_SECRET
    ? process.env.RAZORPAY_KEY_SECRET
    : '';
const razorpay = new razorpay_1.default({
    key_id: razorKeyId,
    key_secret: razorSecret,
});
const createOrder = (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { address } = req.body;
    console.log(address);
    if (!address) {
        throw new ErrorHandler_1.default(404, 'Enter you address fields ');
    }
    let userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) || '';
    const cart = yield cart_model_1.Cart.findOne({ user: userId }).populate('items.product');
    try {
        if (!cart) {
            throw new ErrorHandler_1.default(404, 'Cart not found');
        }
        const totalPrice = cart.items.reduce((sum, item) => {
            const product = item.product;
            const discount = product.offerPercentage || 0;
            const discountedPrice = product.price * (1 - discount / 100);
            return sum + discountedPrice * item.quantity;
        }, 0);
        const options = {
            amount: totalPrice * 100,
            currency: 'INR',
            receipt: `receipt_order_${new Date().getTime()}`,
            notes: {
                userId: userId.toString(),
            },
        };
        const razorpayOrder = yield razorpay.orders.create(options);
        console.log(razorpayOrder);
        const order = new order_model_1.Order({
            user: userId,
            items: cart.items,
            totalPrice,
            status: 'Pending',
            paymentIntentId: razorpayOrder.id,
            deliveryAddress: address.address,
            pincode: address.pinCode,
            city: address.city,
            state: address.state,
        });
        console.log(order);
        yield order.save();
        res.status(200).json(new ResponseHandler_1.default(200, {
            order,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
        }, 'Order created successfully'));
    }
    catch (error) {
        console.log(error);
        throw new ErrorHandler_1.default(500, 'order creation failed');
    }
}));
exports.createOrder = createOrder;
const completeOrder = (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { orderId, paymentId, signature } = req.body;
    let userId = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId) || '';
    const order = yield order_model_1.Order.findById(orderId);
    if (!order) {
        throw new ErrorHandler_1.default(404, 'Order not found');
    }
    const body = order.paymentIntentId + '|' + paymentId;
    const cart = yield cart_model_1.Cart.findOne({ user: userId }).populate('items.product');
    // Generate expected signature using HMAC SHA256
    const hmac = crypto_1.default.createHmac('sha256', razorSecret);
    hmac.update(body);
    const expectedSignature = hmac.digest('hex');
    // Validate the signature
    if (expectedSignature !== signature) {
        throw new ErrorHandler_1.default(400, 'Payment verification failed');
    }
    order.status = 'Completed';
    if (cart) {
        cart.items = [];
        yield cart.save();
    }
    yield order.save();
    res
        .status(200)
        .json(new ResponseHandler_1.default(200, order, 'Order completed successfully'));
}));
exports.completeOrder = completeOrder;
const getOrder = (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const order = yield order_model_1.Order.findById(id).populate('items.product');
    if (!order) {
        throw new ErrorHandler_1.default(404, 'Order not found');
    }
    res
        .status(200)
        .json(new ResponseHandler_1.default(200, order, 'Order fetched successfully'));
}));
exports.getOrder = getOrder;
const getAllUserOrder = (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.userId;
    if (!userId) {
        throw new ErrorHandler_1.default(401, 'User not authenticated');
    }
    const orders = yield order_model_1.Order.find({ user: userId }).populate('items.product');
    if (!orders.length) {
        throw new ErrorHandler_1.default(404, 'No orders found for this user');
    }
    res
        .status(200)
        .json(new ResponseHandler_1.default(200, orders, 'Orders fetched successfully'));
}));
exports.getAllUserOrder = getAllUserOrder;
const getAllOrders = (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield order_model_1.Order.find().populate('items.product');
    if (!orders.length) {
        throw new ErrorHandler_1.default(404, 'No orders found');
    }
    res
        .status(200)
        .json(new ResponseHandler_1.default(200, orders, 'Orders fetched successfully'));
}));
exports.getAllOrders = getAllOrders;
