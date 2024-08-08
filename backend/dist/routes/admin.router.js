"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("../controllers/admin.controller");
const adminAuth_middleware_1 = __importDefault(require("../middlewares/adminAuth.middleware"));
const router = express_1.default.Router();
router.put('/update', adminAuth_middleware_1.default, admin_controller_1.updateAdmin);
router.post('/login', admin_controller_1.loginAdmin);
exports.default = router;
