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
exports.authController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../constant/env");
const error_1 = require("../constant/error");
const httpStatusCode_1 = require("../constant/httpStatusCode");
const jwt_1 = require("../constant/jwt");
const success_1 = require("../constant/success");
const user_model_1 = require("../model/user.model");
const jwt_2 = require("../util/jwt");
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = res.locals.data;
    try {
        const user = yield user_model_1.UserModel.findOne({ email });
        if (user) {
            next({
                status: httpStatusCode_1.HTTP_STATUS_CODE.BAD_REQUEST,
                message: error_1.ERROR_MESSAGE.EMAIL_ALREADY_EXISTS,
            });
            return;
        }
        const hashPassword = bcryptjs_1.default.hashSync(password);
        const newUser = new user_model_1.UserModel({ name, email, password: hashPassword });
        yield newUser.save();
        res.status(httpStatusCode_1.HTTP_STATUS_CODE.CREATED).json({
            type: 'success',
            message: success_1.SUCCESS_MESSAGE.REGISTER_SUCCESS,
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, deviceId, platform } = res.locals.data;
    try {
        const user = yield user_model_1.UserModel.findOne({ email });
        if (!user) {
            next({
                status: httpStatusCode_1.HTTP_STATUS_CODE.BAD_REQUEST,
                message: error_1.ERROR_MESSAGE.EMAIL_DOES_NOT_EXIST,
            });
            return;
        }
        const checkPassword = bcryptjs_1.default.compareSync(password, user.password);
        if (!checkPassword) {
            next({
                status: httpStatusCode_1.HTTP_STATUS_CODE.BAD_REQUEST,
                message: error_1.ERROR_MESSAGE.INCORRECT_PASSWORD,
            });
            return;
        }
        const accessToken = (0, jwt_2.generateJwt)({ userId: user._id, deviceId, name: user.name, avatar: user.avatar }, `${env_1.env.JWT_ACCESS_TOKEN_KEY}`, jwt_1.JWT_EXPIRE_TIME.ACCESS_TOKEN);
        const refreshToken = (0, jwt_2.generateJwt)({ userId: user._id, deviceId }, `${env_1.env.JWT_REFRESH_TOKEN_KEY}`, jwt_1.JWT_EXPIRE_TIME.REFRESH_TOKEN);
        const deviceIndex = user.devices.findIndex(device => device.deviceId === deviceId);
        if (deviceIndex !== -1) {
            user.devices[deviceIndex].refreshToken = refreshToken;
        }
        else {
            user.devices.push({ deviceId, platform, refreshToken });
        }
        yield user.save();
        res.json({
            type: 'success',
            message: success_1.SUCCESS_MESSAGE.LOGIN_SUCCESS,
            data: { accessToken, refreshToken },
        });
    }
    catch (error) {
        next(error);
    }
});
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = res.locals.data;
    try {
        const data = (0, jwt_2.verifyJwt)(refreshToken, `${env_1.env.JWT_REFRESH_TOKEN_KEY}`, next);
        if (!data) {
            return;
        }
        const { userId, deviceId } = data.data;
        const user = yield user_model_1.UserModel.findOne({
            _id: userId,
            devices: {
                $elemMatch: { deviceId, refreshToken },
            },
        });
        if (!user) {
            next({
                status: httpStatusCode_1.HTTP_STATUS_CODE.UNAUTHORIZED,
                message: error_1.ERROR_MESSAGE.INCORRECT_REFRESH_TOKEN,
            });
            return;
        }
        const accessToken = (0, jwt_2.generateJwt)({ userId, deviceId, name: user.name, avatar: user.avatar }, `${env_1.env.JWT_ACCESS_TOKEN_KEY}`, jwt_1.JWT_EXPIRE_TIME.ACCESS_TOKEN);
        res.json({
            type: 'success',
            message: success_1.SUCCESS_MESSAGE.REFRESH_TOKEN_SUCCESS,
            data: { accessToken },
        });
    }
    catch (error) {
        next(error);
    }
});
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, deviceId } = res.locals;
    try {
        const user = yield user_model_1.UserModel.findById(userId);
        if (user) {
            const deviceIndex = user.devices.findIndex(device => device.deviceId === deviceId);
            if (deviceIndex !== -1) {
                user.devices[deviceIndex].refreshToken = null;
                user.devices[deviceIndex].fcmToken = null;
                yield user.save();
            }
        }
        res.json({
            type: 'success',
            message: success_1.SUCCESS_MESSAGE.LOGOUT_SUCCESS,
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.authController = { register, login, refreshToken, logout };
