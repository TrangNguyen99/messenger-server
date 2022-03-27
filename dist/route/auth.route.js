"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoute = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controller/auth.controller");
const verifyAccessToken_1 = require("../middleware/verifyAccessToken");
const auth_validation_1 = require("../validation/auth.validation");
const router = express_1.default.Router();
router.post('/register', auth_validation_1.authValidation.register, auth_controller_1.authController.register);
router.post('/login', auth_validation_1.authValidation.login, auth_controller_1.authController.login);
router.post('/refresh-token', auth_validation_1.authValidation.refreshToken, auth_controller_1.authController.refreshToken);
router.delete('/logout', auth_validation_1.authValidation.logout, verifyAccessToken_1.verifyAccessToken, auth_controller_1.authController.logout);
exports.authRoute = router;
