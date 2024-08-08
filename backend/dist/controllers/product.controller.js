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
exports.searchProducts = exports.deleteProduct = exports.getProductById = exports.getAllProducts = exports.updateProduct = exports.createProduct = void 0;
const AsyncHandler_1 = __importDefault(require("../utilities/AsyncHandler"));
const ErrorHandler_1 = __importDefault(require("../utilities/ErrorHandler"));
const ResponseHandler_1 = __importDefault(require("../utilities/ResponseHandler"));
const zod_1 = require("zod");
const product_model_1 = require("../models/product.model");
const cloudinaryUtils_1 = require("../utilities/cloudinaryUtils");
const productSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).max(100),
    description: zod_1.z.string().min(10).max(1000),
    price: zod_1.z.number().min(0),
    category: zod_1.z.string().min(3).max(50).default('All'),
    stock: zod_1.z.number().min(0),
    imageUrl: zod_1.z.string(),
    dosage: zod_1.z.string().default('As prescribed by Doctor.'),
    directions: zod_1.z.string().default('As described by Doctor.'),
    packOf: zod_1.z.number(),
    offerPercentage: zod_1.z.number(),
    brand: zod_1.z.string().min(2).max(100),
});
const getAllProducts = (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield product_model_1.Product.find();
    if (!products) {
        throw new ErrorHandler_1.default(404, 'No products found');
    }
    res
        .status(200)
        .json(new ResponseHandler_1.default(200, products, 'Products fetched successfully'));
}));
exports.getAllProducts = getAllProducts;
const getProductById = (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const product = yield product_model_1.Product.findById(id);
    try {
        if (!id) {
            throw new ErrorHandler_1.default(404, 'please provide id');
        }
        if (!product) {
            throw new ErrorHandler_1.default(404, 'Product not found');
        }
        res
            .status(200)
            .json(new ResponseHandler_1.default(200, product, 'Product fetched successfully'));
    }
    catch (error) {
        throw new ErrorHandler_1.default(500, `Error creating product: ${error.message}`);
    }
}));
exports.getProductById = getProductById;
const createProduct = (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const file = req.file || undefined;
        if (!file) {
            throw new ErrorHandler_1.default(400, 'Image file is required');
        }
        const imageLocalPath = file.path;
        const imageUrl = (_a = (yield (0, cloudinaryUtils_1.uploadToCloudinary)(imageLocalPath))) === null || _a === void 0 ? void 0 : _a.url;
        if (!imageUrl) {
            throw new ErrorHandler_1.default(500, 'Image upload failed');
        }
        const { name, description, price, stock, category, dosage, directions, packOf, offerPercentage, brand, } = req.body;
        const productData = {
            name,
            description,
            price: parseInt(price),
            stock: parseInt(stock),
            category,
            dosage,
            directions,
            packOf: parseInt(packOf),
            offerPercentage: parseInt(offerPercentage),
            imageUrl,
            brand,
        };
        const { success, error } = productSchema.safeParse(productData);
        if (!success) {
            throw new ErrorHandler_1.default(400, `Invalid Inputs: ${error.message}`);
        }
        const product = yield product_model_1.Product.create(productData);
        return res
            .status(201)
            .json(new ResponseHandler_1.default(201, product, 'Product created successfully'));
    }
    catch (error) {
        throw new ErrorHandler_1.default(500, `Error creating product: ${error.message}`);
    }
}));
exports.createProduct = createProduct;
const updateProduct = (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { productId } = req.params;
    const file = req.file || undefined;
    let imageUrl;
    if (file) {
        const imageLocalPath = file.path;
        imageUrl = (_b = (yield (0, cloudinaryUtils_1.uploadToCloudinary)(imageLocalPath))) === null || _b === void 0 ? void 0 : _b.url;
        if (!imageUrl) {
            throw new ErrorHandler_1.default(500, 'Image upload failed');
        }
    }
    console.log(req.body);
    const productData = imageUrl ? Object.assign(Object.assign({}, req.body), { imageUrl }) : req.body;
    console.log(productData);
    const { success, error } = productSchema.partial().safeParse(productData);
    if (!success) {
        throw new ErrorHandler_1.default(400, `Invalid Inputs: ${error.message}`);
    }
    const product = yield product_model_1.Product.findByIdAndUpdate(productId, productData, {
        new: true,
        runValidators: true,
    });
    if (!product) {
        throw new ErrorHandler_1.default(404, 'Product not found');
    }
    return res
        .status(200)
        .json(new ResponseHandler_1.default(200, product, 'Product updated successfully'));
}));
exports.updateProduct = updateProduct;
const deleteProduct = (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const product = yield product_model_1.Product.findByIdAndDelete(productId);
    if (!product) {
        throw new ErrorHandler_1.default(404, 'Product not found');
    }
    return res
        .status(200)
        .json(new ResponseHandler_1.default(200, null, 'Product deleted successfully'));
}));
exports.deleteProduct = deleteProduct;
const searchProducts = (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req.query;
    if (!query || typeof query !== 'string') {
        throw new ErrorHandler_1.default(400, 'Query parameter is required and must be a string');
    }
    const searchTerm = query.trim();
    const products = yield product_model_1.Product.find({
        $or: [
            { name: { $regex: searchTerm, $options: 'i' } },
            { description: { $regex: searchTerm, $options: 'i' } },
            { brand: { $regex: searchTerm, $options: 'i' } },
        ],
    });
    if (products.length === 0) {
        return res.status(404).json(new ResponseHandler_1.default(404, [], 'No products found'));
    }
    res
        .status(200)
        .json(new ResponseHandler_1.default(200, products, 'Products fetched successfully'));
}));
exports.searchProducts = searchProducts;
