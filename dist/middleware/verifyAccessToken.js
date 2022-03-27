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
exports.verifyAccessToken = void 0;
const env_1 = require("../constant/env");
const error_1 = require("../constant/error");
const httpStatusCode_1 = require("../constant/httpStatusCode");
const jwt_1 = require("../util/jwt");
const verifyAccessToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const headerToken = req.headers.authorization;
    if (!headerToken) {
        next({
            status: httpStatusCode_1.HTTP_STATUS_CODE.UNAUTHORIZED,
            message: error_1.ERROR_MESSAGE.MISSING_AUTH_HEADER,
        });
        return;
    }
    const accessToken = headerToken.split('Bearer ')[1];
    if (!accessToken) {
        next({
            status: httpStatusCode_1.HTTP_STATUS_CODE.UNAUTHORIZED,
            message: error_1.ERROR_MESSAGE.MISSING_ACCESS_TOKEN,
        });
        return;
    }
    const data = (0, jwt_1.verifyJwt)(accessToken, `${env_1.env.JWT_ACCESS_TOKEN_KEY}`, next);
    if (!data) {
        return;
    }
    res.locals.userId = data.data.userId;
    res.locals.deviceId = data.data.deviceId;
    res.locals.name = data.data.name;
    res.locals.avatar = data.data.avatar;
    next();
});
exports.verifyAccessToken = verifyAccessToken;
