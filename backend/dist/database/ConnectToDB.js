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
const mongoose_1 = __importDefault(require("mongoose"));
require("../config/env");
const admin_model_1 = require("../models/admin.model");
const uri = process.env.MONGO_URI;
function ConnectToDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (uri) {
                yield mongoose_1.default.connect(uri).catch((err) => {
                    throw new Error(err.message);
                });
                const adminCount = yield admin_model_1.Admin.countDocuments();
                if (adminCount === 0) {
                    const defaultAdmin = new admin_model_1.Admin({
                        username: 'admin',
                        password: 'mypass123',
                    });
                    yield defaultAdmin.save();
                    console.log('Default admin created');
                }
                console.log(mongoose_1.default.connection.readyState
                    ? 'Successfully Connected To Database !!'
                    : 'NOT CONNECTED TO DATABASE');
            }
        }
        catch (error) {
            console.log(error.message);
        }
    });
}
exports.default = ConnectToDatabase;
