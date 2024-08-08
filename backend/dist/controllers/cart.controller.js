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
exports.getCart = exports.removeFromCart = exports.addToCart = void 0;
const AsyncHandler_1 = __importDefault(require("../utilities/AsyncHandler"));
const ErrorHandler_1 = __importDefault(require("../utilities/ErrorHandler"));
const ResponseHandler_1 = __importDefault(require("../utilities/ResponseHandler"));
const cart_model_1 = require("../models/cart.model");
const product_model_1 = require("../models/product.model");
const getCart = (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const cart = yield cart_model_1.Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) {
        return res.status(200).json(new ResponseHandler_1.default(200, [], 'empty cart'));
    }
    if ((cart === null || cart === void 0 ? void 0 : cart.items.length) == 0) {
        // await cart.deleteOne({ user: userId })
        return res.status(200).json(new ResponseHandler_1.default(200, [], 'empty cart'));
    }
    res
        .status(200)
        .json(new ResponseHandler_1.default(200, cart, 'Cart fetched successfully'));
}));
exports.getCart = getCart;
const addToCart = (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
        const { productId } = req.body;
        const product = yield product_model_1.Product.findById(productId);
        if (!product) {
            throw new ErrorHandler_1.default(404, 'Product not found');
        }
        let cart = yield cart_model_1.Cart.findOne({ user: userId });
        if (!cart) {
            cart = new cart_model_1.Cart({ user: userId, items: [] });
        }
        const cartItemIndex = cart.items.findIndex((item) => item.product.equals(productId));
        if (cartItemIndex > -1) {
            cart.items[cartItemIndex].quantity += 1;
        }
        else {
            cart.items.push({ product: productId, quantity: 1 });
        }
        yield cart.save();
        cart = yield cart_model_1.Cart.findOne({ user: userId }).populate('items.product');
        res.status(200).json(new ResponseHandler_1.default(200, cart, 'Product added to cart'));
    }
    catch (error) {
        throw new ErrorHandler_1.default(500, `Error adding product to cart: ${error.message}`);
    }
}));
exports.addToCart = addToCart;
const removeFromCart = (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.userId;
        const { productId } = req.body;
        if (!userId) {
            throw new ErrorHandler_1.default(401, 'User not authenticated');
        }
        let cart = yield cart_model_1.Cart.findOne({ user: userId });
        if (!cart) {
            throw new ErrorHandler_1.default(404, 'Cart not found');
        }
        const cartItemIndex = cart.items.findIndex((item) => item.product.equals(productId));
        if (cartItemIndex === -1) {
            throw new ErrorHandler_1.default(404, 'Product not found in cart');
        }
        if (cart.items[cartItemIndex].quantity > 1) {
            cart.items[cartItemIndex].quantity -= 1;
        }
        else {
            cart.items.splice(cartItemIndex, 1);
        }
        yield cart.save();
        cart = yield cart_model_1.Cart.findOne({ user: userId }).populate('items.product');
        res
            .status(200)
            .json(new ResponseHandler_1.default(200, cart, 'Product quantity updated in cart'));
    }
    catch (error) {
        throw new ErrorHandler_1.default(500, `Error updating product in cart: ${error.message}`);
    }
}));
exports.removeFromCart = removeFromCart;
