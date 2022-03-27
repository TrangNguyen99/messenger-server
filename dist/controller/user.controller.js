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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const env_1 = require("../constant/env");
const error_1 = require("../constant/error");
const httpStatusCode_1 = require("../constant/httpStatusCode");
const success_1 = require("../constant/success");
const user_model_1 = require("../model/user.model");
const resizeImage_1 = require("../util/resizeImage");
const getMe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = res.locals;
    try {
        const user = yield user_model_1.UserModel.findById(userId).select('name email avatar');
        res.json({
            type: 'success',
            message: success_1.SUCCESS_MESSAGE.SUCCESS,
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
});
const getOthers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = res.locals;
    try {
        const users = yield user_model_1.UserModel.find({ _id: { $ne: userId } }).select('name avatar');
        res.json({
            type: 'success',
            message: success_1.SUCCESS_MESSAGE.SUCCESS,
            data: users,
        });
    }
    catch (error) {
        next(error);
    }
});
const getPublicUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { data: { userId }, } = res.locals;
    try {
        const user = yield user_model_1.UserModel.findById(userId).select('name avatar');
        if (!user) {
            next({
                status: httpStatusCode_1.HTTP_STATUS_CODE.BAD_REQUEST,
                message: error_1.ERROR_MESSAGE.INCORRECT_USER_ID,
            });
            return;
        }
        res.json({
            type: 'success',
            message: success_1.SUCCESS_MESSAGE.SUCCESS,
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
});
const updateFcmToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, deviceId, data: { fcmToken }, } = res.locals;
    try {
        const user = yield user_model_1.UserModel.findOne({
            _id: userId,
            devices: { $elemMatch: { deviceId } },
        });
        if (!user) {
            next({
                status: httpStatusCode_1.HTTP_STATUS_CODE.BAD_REQUEST,
                message: error_1.ERROR_MESSAGE.INCORRECT_ACCESS_TOKEN,
            });
            return;
        }
        const deviceIndex = user.devices.findIndex(device => device.deviceId === deviceId);
        user.devices[deviceIndex].fcmToken = fcmToken;
        yield user.save();
        res.json({
            type: 'success',
            message: success_1.SUCCESS_MESSAGE.SUCCESS,
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
const updateAvatar = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = res.locals;
    try {
        if (!req.file) {
            next({
                status: httpStatusCode_1.HTTP_STATUS_CODE.BAD_REQUEST,
                message: error_1.ERROR_MESSAGE.MISSING_AVATAR,
            });
            return;
        }
        const fileName = yield (0, resizeImage_1.resizeAvatar)(req.file.buffer, next);
        if (!fileName) {
            return;
        }
        const avatarUrl = `http://${env_1.env.HOST}:${env_1.env.PORT}/image/avatar/${fileName}`;
        yield user_model_1.UserModel.findByIdAndUpdate(userId, {
            avatar: avatarUrl,
        });
        res.json({
            type: 'success',
            message: success_1.SUCCESS_MESSAGE.SUCCESS,
            data: {
                avatar: avatarUrl,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.userController = {
    getMe,
    getOthers,
    getPublicUser,
    updateFcmToken,
    updateAvatar,
};
