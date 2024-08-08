"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRouter = void 0;
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../controllers/product.controller");
const userAuth_middleware_1 = __importDefault(require("../middlewares/userAuth.middleware"));
const multer_1 = __importDefault(require("../config/multer"));
const router = express_1.default.Router();
exports.productRouter = router;
router.get('/products', product_controller_1.getAllProducts);
router.get('/search', product_controller_1.searchProducts);
router.get('/:id', product_controller_1.getProductById);
router.post('/create', userAuth_middleware_1.default, multer_1.default.single('productImage'), product_controller_1.createProduct);
router.put('/update/:productId', userAuth_middleware_1.default, multer_1.default.single('productImage'), product_controller_1.updateProduct);
router.delete('/delete/:productId', userAuth_middleware_1.default, product_controller_1.deleteProduct);
