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
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
    firstName: { type: String, min: [1, 'Name too short.'] },
    lastName: { type: String, min: [1, 'Name too short.'] },
    username: {
        type: String,
        min: [4, 'Username is too short.'],
        required: true,
        unique: true,
    },
    password: {
        type: String,
        min: [8, 'Min length of password should be 8.'],
        max: [40, 'Max length of password should be 40.'],
        validate: {
            validator: function (value) {
                return this.googleId || value != null;
            },
            message: 'Password is required for traditional signups.',
        },
    },
    avatar: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    faceDescriptors: { type: Array },
    googleId: { type: String },
}, { timestamps: true });
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password') || !this.password) {
            return next();
        }
        try {
            console.log('Hashing password before saving...');
            const salt = yield bcrypt_1.default.genSalt(10);
            this.password = yield bcrypt_1.default.hash(this.password, salt);
            console.log('Password hashed:', this.password);
            next();
        }
        catch (err) {
            next(err);
        }
    });
});
userSchema.methods.isPasswordCorrect = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.password) {
            return false;
        }
        console.log('Comparing password:', password, 'with hashed password:', this.password);
        const isMatch = yield bcrypt_1.default.compare(password, this.password);
        console.log('Password comparison result:', isMatch);
        return isMatch;
    });
};
const User = mongoose_1.default.model('User', userSchema);
exports.User = User;
