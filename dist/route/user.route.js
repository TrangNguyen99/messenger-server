"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controller/user.controller");
const uploadAvatar_1 = require("../middleware/uploadAvatar");
const verifyAccessToken_1 = require("../middleware/verifyAccessToken");
const user_validation_1 = require("../validation/user.validation");
const router = express_1.default.Router();
router.get('/me', user_validation_1.userValidation.getMe, verifyAccessToken_1.verifyAccessToken, user_controller_1.userController.getMe);
router.get('/others', user_validation_1.userValidation.getOthers, verifyAccessToken_1.verifyAccessToken, user_controller_1.userController.getOthers);
router.get('/public/:userId', user_validation_1.userValidation.getPublicUser, user_controller_1.userController.getPublicUser);
router.patch('/fcm', user_validation_1.userValidation.updateFcmToken, verifyAccessToken_1.verifyAccessToken, user_controller_1.userController.updateFcmToken);
router.patch('/avatar', user_validation_1.userValidation.updateAvatar, verifyAccessToken_1.verifyAccessToken, uploadAvatar_1.uploadAvatar.single('avatar'), user_controller_1.userController.updateAvatar);
exports.userRoute = router;
