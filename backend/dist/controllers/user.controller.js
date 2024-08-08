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
exports.userLogin = exports.updateUser = exports.getUser = exports.googleLogin = exports.userSignup = exports.userLogout = exports.checkAuth = void 0;
const AsyncHandler_1 = __importDefault(require("../utilities/AsyncHandler"));
const ErrorHandler_1 = __importDefault(require("../utilities/ErrorHandler"));
const ResponseHandler_1 = __importDefault(require("../utilities/ResponseHandler"));
const user_model_1 = require("../models/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const cloudinaryUtils_1 = require("../utilities/cloudinaryUtils");
const Oauth_1 = require("../utilities/Oauth");
const signupSchema = zod_1.z.object({
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
    username: zod_1.z.string(),
    password: zod_1.z.string(),
    avatar: zod_1.z.any(),
    email: zod_1.z.string().email(),
});
const userSignup = (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { firstName, lastName, username, password, avatar, email } = req.body;
    try {
        const { success, error } = signupSchema.safeParse(req.body);
        if (!success) {
            throw new ErrorHandler_1.default(401, `Invalid Inputs ${error}`);
        }
        const existingUser = yield user_model_1.User.findOne({ email });
        if (existingUser) {
            throw new ErrorHandler_1.default(409, 'User Already exists');
        }
        const file = req.file || undefined;
        const avatarLocalPath = (file === null || file === void 0 ? void 0 : file.path) || '';
        if (!avatarLocalPath) {
            throw new ErrorHandler_1.default(400, 'Avatar file is required or is invalid');
        }
        const avatarUrl = (_a = (yield (0, cloudinaryUtils_1.uploadToCloudinary)(avatarLocalPath))) === null || _a === void 0 ? void 0 : _a.url;
        const user = yield user_model_1.User.create({
            firstName,
            lastName,
            username,
            password: password,
            avatar: avatarUrl,
            email,
        });
        const createdUser = yield user_model_1.User.findById(user._id).select('-password');
        if (!createdUser) {
            throw new ErrorHandler_1.default(500, 'Something went wrong while registering the user');
        }
        return res
            .status(200)
            .json(new ResponseHandler_1.default(200, createdUser, 'User Registered Successfully'));
    }
    catch (error) {
        throw new Error(`Error during Signup.. User not Registered , Error =  ${error}`);
    }
}));
exports.userSignup = userSignup;
const generateUniqueUsername = (displayName) => __awaiter(void 0, void 0, void 0, function* () {
    if (!displayName) {
        displayName = 'newUser';
    }
    const { nanoid } = yield Promise.resolve().then(() => __importStar(require('nanoid')));
    displayName = displayName.split(' ')[0];
    return `${displayName}-${nanoid(5)}`;
});
const googleLogin = (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    try {
        const payload = yield (0, Oauth_1.verifyGoogleToken)(token);
        if (!payload) {
            throw new ErrorHandler_1.default(401, 'Invalid Google token');
        }
        const { sub: googleId, email, given_name, family_name, name, picture, } = payload;
        const username = yield generateUniqueUsername(name);
        let user = yield user_model_1.User.findOne({ email });
        if (!user) {
            user = yield user_model_1.User.create({
                googleId,
                username,
                firstName: given_name,
                lastName: family_name,
                email,
                avatar: picture,
            });
        }
        else if (!user.googleId) {
            user.googleId = googleId;
            yield user.save();
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET environment variable is not defined');
        }
        const jwtToken = jsonwebtoken_1.default.sign({ userId: user._id }, secret, {
            expiresIn: '4h',
        });
        res.cookie('token', jwtToken);
        const resUser = yield user_model_1.User.findOne({ email }).select([
            '-password',
            '-googleId',
        ]);
        return res
            .status(200)
            .json(new ResponseHandler_1.default(200, { resUser, token: jwtToken }));
    }
    catch (error) {
        console.log('ERROR from controller');
        throw new Error(error.message);
    }
}));
exports.googleLogin = googleLogin;
// const addface = asyncHandler(async (req: Request, res: Response) => {
//   const { userId } = req.body
//   const file = (req.file as Express.Multer.File) || undefined
//   const imageLocalPath = file?.path || ''
//   try {
//     if (!imageLocalPath) {
//       throw new ApiError(400, 'Avatar file is required or is invalid')
//     }
//     const faceidUrl: string = (await uploadToCloudinary(imageLocalPath))?.url
//     const img = await faceapi.fetchImage(faceidUrl)
//     const detections = await faceapi
//       .detectSingleFace(img)
//       .withFaceLandmarks()
//       .withFaceDescriptor()
//     const user = await User.findById(userId)
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' })
//     }
//     user.faceDescriptors = detections?.descriptor
//     await user.save()
//     res.status(200).json({ message: 'Face descriptors added successfully' })
//   } catch (error) {
//     console.log(error)
//     throw new Error((error as Error).message)
//   }
// })
// const loginFace = asyncHandler(async (req: Request, res: Response) => {
//   const { userId } = req.body
//   const file = (req.file as Express.Multer.File) || undefined
//   const imageLocalPath = file?.path || ''
//   try {
//     if (!imageLocalPath) {
//       throw new ApiError(400, 'Avatar file is required or is invalid')
//     }
//     const faceidUrl: string = (await uploadToCloudinary(imageLocalPath))?.url
//     const img = await faceapi.fetchImage(faceidUrl)
//     const detections = await faceapi
//       .detectSingleFace(img)
//       .withFaceLandmarks()
//       .withFaceDescriptor()
//     if (!detections) {
//       return res.status(400).json(new ApiResponse(400, 'No face detected'))
//     }
//     const users = await User.find()
//     const faceMatcher = new faceapi.FaceMatcher(
//       users.map(
//         (user) =>
//           new faceapi.LabeledFaceDescriptors(user._id.toString(), [
//             new Float32Array(user.faceDescriptors),
//           ])
//       )
//     )
//     const bestMatch = faceMatcher.findBestMatch(detections.descriptor)
//     if (bestMatch.label === 'unknown') {
//       return res.status(401).json({ error: 'Face not recognized' })
//     }
//     const user = await User.findById(bestMatch.label)
//     const secret = process.env.JWT_SECRET
//     if (!secret) {
//       throw new Error('JWT_SECRET environment variable is not defined')
//     }
//     const token = jwt.sign({ userId: user?._id }, secret, {
//       expiresIn: '4h',
//     })
//     res.cookie('token', token)
//     res.status(200).json({ user, token })
//   } catch (error) {}
// })
const getUser = (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
    const user = yield user_model_1.User.findById(userId).select('-password');
    if (!user) {
        throw new ErrorHandler_1.default(404, 'User not found');
    }
    res
        .status(200)
        .json(new ResponseHandler_1.default(200, user, 'User fetched successfully'));
}));
exports.getUser = getUser;
// Update username and profile picture
const updateUser = (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const { id } = req.params;
    const { username } = req.body;
    const file = req.file || undefined;
    const avatarLocalPath = (file === null || file === void 0 ? void 0 : file.path) || '';
    try {
        const user = yield user_model_1.User.findById(id);
        if (!user) {
            throw new ErrorHandler_1.default(404, 'User not found');
        }
        if (username) {
            user.username = username;
        }
        if (avatarLocalPath) {
            const avatarUrl = (_c = (yield (0, cloudinaryUtils_1.uploadToCloudinary)(avatarLocalPath))) === null || _c === void 0 ? void 0 : _c.url;
            user.avatar = avatarUrl;
        }
        yield user.save();
        const updatedUser = yield user_model_1.User.findById(id).select('-password');
        res
            .status(200)
            .json(new ResponseHandler_1.default(200, updatedUser, 'User updated successfully'));
    }
    catch (error) {
        throw new Error(`Error during user update, Error =  ${error}`);
    }
}));
exports.updateUser = updateUser;
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(4).max(40),
});
const userLogin = (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const parsedData = loginSchema.safeParse(req.body);
    if (!parsedData.success) {
        throw new ErrorHandler_1.default(401, `Invalid Inputs: ${parsedData.error.message}`);
    }
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new ErrorHandler_1.default(401, 'Invalid email or password');
    }
    const isMatch = yield user.isPasswordCorrect(password);
    if (!isMatch) {
        throw new ErrorHandler_1.default(401, 'Invalid email or password');
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET environment variable is not defined');
    }
    const token = jsonwebtoken_1.default.sign({ userId: user._id }, secret, { expiresIn: '4h' });
    res.cookie('token', token, { httpOnly: true });
    const userWithoutPassword = yield user_model_1.User.findById(user._id).select('-password');
    return res
        .status(200)
        .json(new ResponseHandler_1.default(200, { user: userWithoutPassword, token }, 'User logged in successfully'));
}));
exports.userLogin = userLogin;
const userLogout = (0, AsyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('logout ran');
        res.cookie('token', '', {
            httpOnly: true,
        });
        res
            .status(200)
            .json(new ResponseHandler_1.default(200, null, 'User logged out successfully'));
    }
    catch (error) {
        res.status(500).json({ error: 'Something went wrong during logout' });
    }
}));
exports.userLogout = userLogout;
const checkAuth = (req, res) => {
    if (req.cookies.token) {
        res.status(200).json({ token: req.cookies.token });
    }
    else {
        res.status(401).json({ message: 'Not authenticated' });
    }
};
exports.checkAuth = checkAuth;
