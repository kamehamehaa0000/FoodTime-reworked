"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_router_1 = __importDefault(require("./user.router"));
const product_router_1 = require("./product.router");
const cart_router_1 = require("./cart.router");
const order_router_1 = require("./order.router");
const admin_router_1 = __importDefault(require("./admin.router"));
const router = express_1.default.Router();
exports.mainRouter = router;
router.use('/user', user_router_1.default);
router.use('/product', product_router_1.productRouter);
router.use('/cart', cart_router_1.cartRouter);
router.use('/order', order_router_1.orderRouter);
router.use('/admin', admin_router_1.default);
