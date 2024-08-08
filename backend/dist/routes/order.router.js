"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRouter = void 0;
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("../controllers/order.controller");
const userAuth_middleware_1 = __importDefault(require("../middlewares/userAuth.middleware"));
const router = express_1.default.Router();
exports.orderRouter = router;
router.get('/:id', userAuth_middleware_1.default, order_controller_1.getOrder);
router.post('/create', userAuth_middleware_1.default, order_controller_1.createOrder);
router.post('/complete', userAuth_middleware_1.default, order_controller_1.completeOrder);
