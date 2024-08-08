"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const diskStorage = multer_1.default.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/temp');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    },
});
const upload = (0, multer_1.default)({
    storage: diskStorage,
});
exports.default = upload;
