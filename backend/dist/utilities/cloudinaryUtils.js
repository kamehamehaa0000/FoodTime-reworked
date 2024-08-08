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
exports.deleteFromCloudinary = exports.uploadToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
require("../config/env");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});
const uploadToCloudinary = (localPath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!localPath) {
            throw new Error('invalid or undefined local path');
        }
        const res = yield cloudinary_1.v2.uploader.upload(localPath, {
            resource_type: 'auto',
        });
        fs_1.default.unlink(localPath, (err) => {
            if (err) {
                console.error(`Error deleting file: ${err.message}`);
            }
        });
        return res;
    }
    catch (error) {
        fs_1.default.unlink(localPath, (err) => {
            if (err) {
                console.error(`Error deleting file: ${err.message}`);
            }
        });
        console.log('Error occured during cloudinary upload ----- ' + error);
        throw new Error('Error occured during cloudinary upload ----- ' + error);
    }
});
exports.uploadToCloudinary = uploadToCloudinary;
const deleteFromCloudinary = (url) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (url) {
            // Extract the public ID from the URL
            const publicId = ((_a = url.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('.')[0]) || '';
            if (publicId) {
                // Delete the image from Cloudinary
                yield cloudinary_1.v2.uploader.destroy(publicId);
            }
            else {
                console.error('Invalid URL: Could not extract public ID.');
            }
        }
        else {
            console.error('URL is required.');
        }
    }
    catch (error) {
        console.error(`Error deleting image from Cloudinary: ${error.message}`);
    }
});
exports.deleteFromCloudinary = deleteFromCloudinary;
