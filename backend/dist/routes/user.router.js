"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("../config/multer"));
const user_controller_1 = require("../controllers/user.controller");
const userAuth_middleware_1 = __importDefault(require("../middlewares/userAuth.middleware"));
const router = express_1.default.Router();
router.get('/getUser', userAuth_middleware_1.default, user_controller_1.getUser);
router.put('/update/:id', userAuth_middleware_1.default, multer_1.default.single('avatar'), user_controller_1.updateUser);
router.post('/signup', multer_1.default.single('avatar'), user_controller_1.userSignup);
router.post('/signin', user_controller_1.userLogin);
router.post('/logout', user_controller_1.userLogout);
router.post('/google', user_controller_1.googleLogin);
router.get('/check-auth', user_controller_1.checkAuth);
// router.post('/user/add-face', upload.single('addFace'), addface)
// router.post('/user/login-face', upload.single('loginFace'), loginFace)
exports.default = router;
