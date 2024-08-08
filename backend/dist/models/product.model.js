"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const productSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        min: [3, 'Name is too short.'],
        max: [100, 'Name is too long.'],
    },
    description: {
        type: String,
        required: true,
        min: [10, 'Description is too short.'],
        max: [1000, 'Description is too long.'],
    },
    dosage: {
        type: String,
        required: true,
        default: 'As prescribed by Doctor.',
    },
    directions: {
        type: String,
        required: true,
        default: 'As described by Doctor.',
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative.'],
    },
    category: {
        type: String,
        required: true,
        default: 'All',
        min: [3, 'Category is too short.'],
        max: [50, 'Category is too long.'],
    },
    stock: {
        type: Number,
        required: true,
        min: [0, 'Stock cannot be negative.'],
    },
    imageUrl: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    packOf: { type: Number, default: 1 },
    offerPercentage: { type: Number, default: 0 },
    available: { type: Boolean, default: true },
}, { timestamps: true });
const Product = mongoose_1.default.model('Product', productSchema);
exports.Product = Product;
