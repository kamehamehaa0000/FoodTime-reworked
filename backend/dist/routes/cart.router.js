"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartRouter = void 0;
const express_1 = __importDefault(require("express"));
const cart_controller_1 = require("../controllers/cart.controller");
const userAuth_middleware_1 = __importDefault(require("../middlewares/userAuth.middleware"));
const router = express_1.default.Router();
exports.cartRouter = router;
router.get('/getcart', userAuth_middleware_1.default, cart_controller_1.getCart);
router.post('/add', userAuth_middleware_1.default, cart_controller_1.addToCart);
router.post('/remove', userAuth_middleware_1.default, cart_controller_1.removeFromCart);
