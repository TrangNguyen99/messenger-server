"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = exports.generateJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const httpStatusCode_1 = require("../constant/httpStatusCode");
const generateJwt = (data, key, expiresIn) => {
    return jsonwebtoken_1.default.sign({ data }, key, { expiresIn });
};
exports.generateJwt = generateJwt;
const verifyJwt = (token, key, next) => {
    try {
        const res = jsonwebtoken_1.default.verify(token, key);
        return res;
    }
    catch (error) {
        next({
            status: httpStatusCode_1.HTTP_STATUS_CODE.UNAUTHORIZED,
            message: error.message,
        });
    }
};
exports.verifyJwt = verifyJwt;
