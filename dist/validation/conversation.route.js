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
exports.conversationValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const httpStatusCode_1 = require("../constant/httpStatusCode");
const getConversations = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const condition = joi_1.default.object({});
    try {
        yield condition.validateAsync(req.body, { abortEarly: false });
        next();
    }
    catch (error) {
        next({
            status: httpStatusCode_1.HTTP_STATUS_CODE.BAD_REQUEST,
            message: error.message,
        });
    }
});
const createPrivateConversation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const condition = joi_1.default.object({
        partnerId: joi_1.default.string()
            .required()
            .regex(/^[0-9a-fA-F]{24}$/),
    });
    try {
        const data = yield condition.validateAsync(req.body, { abortEarly: false });
        res.locals.data = data;
        next();
    }
    catch (error) {
        next({
            status: httpStatusCode_1.HTTP_STATUS_CODE.BAD_REQUEST,
            message: error.message,
        });
    }
});
exports.conversationValidation = {
    getConversations,
    createPrivateConversation,
};
