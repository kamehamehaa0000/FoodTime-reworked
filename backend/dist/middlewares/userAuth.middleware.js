"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ErrorHandler_1 = __importDefault(require("../utilities/ErrorHandler"));
const authenticate = (req, res, next) => {
    var _a;
    const token = req.cookies.token || ((_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', ''));
    if (!token) {
        return next(new ErrorHandler_1.default(401, 'No token provided, authorization denied'));
    }
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET environment variable is not defined');
        }
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.user = { userId: decoded.userId };
        next();
    }
    catch (err) {
        return next(new ErrorHandler_1.default(401, 'Token is not valid'));
    }
};
exports.default = authenticate;
