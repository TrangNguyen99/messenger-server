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
exports.resizeAvatar = void 0;
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const httpStatusCode_1 = require("../constant/httpStatusCode");
const resizeAvatar = (buffer, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const folder = path_1.default.join(__dirname, '../../public/image/avatar');
        const fileName = Date.now() + '-' + Math.round(Math.random() * 1e9) + '.jpg';
        const filePath = path_1.default.resolve(`${folder}/${fileName}`);
        yield (0, sharp_1.default)(buffer).resize(300, 300).toFile(filePath);
        return fileName;
    }
    catch (error) {
        next({
            status: httpStatusCode_1.HTTP_STATUS_CODE.BAD_REQUEST,
            message: error.message,
        });
    }
});
exports.resizeAvatar = resizeAvatar;
