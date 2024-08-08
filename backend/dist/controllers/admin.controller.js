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
exports.updateAdmin = exports.loginAdmin = void 0;
const admin_model_1 = require("../models/admin.model");
const ErrorHandler_1 = __importDefault(require("../utilities/ErrorHandler"));
const ResponseHandler_1 = __importDefault(require("../utilities/ResponseHandler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const loginAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const admin = yield admin_model_1.Admin.findOne({ username });
        if (!admin) {
            throw new ErrorHandler_1.default(401, 'Invalid credentials');
        }
        const isMatch = yield admin.isPasswordCorrect(password);
        if (!isMatch) {
            throw new ErrorHandler_1.default(401, 'Invalid credentials');
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET environment variable is not defined');
        }
        const token = jsonwebtoken_1.default.sign({ adminId: admin._id }, secret, { expiresIn: '4h' });
        res.cookie('token', token);
        res
            .status(200)
            .json(new ResponseHandler_1.default(200, { admin, token }, 'Login successful'));
    }
    catch (error) {
        next(new ErrorHandler_1.default(500, error.message));
    }
});
exports.loginAdmin = loginAdmin;
const updateAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const admin = yield admin_model_1.Admin.findOne();
        if (!admin) {
            throw new ErrorHandler_1.default(404, 'Admin not found');
        }
        if (username) {
            admin.username = username;
        }
        if (password) {
            admin.password = yield bcrypt_1.default.hash(password, 10);
        }
        yield admin.save();
        res
            .status(200)
            .json(new ResponseHandler_1.default(200, admin.populate('-password'), 'Admin updated successfully'));
    }
    catch (error) {
        next(new ErrorHandler_1.default(500, error.message));
    }
});
exports.updateAdmin = updateAdmin;
