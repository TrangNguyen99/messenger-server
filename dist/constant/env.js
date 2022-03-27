"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
exports.env = {
    MONGODB_URI: process.env.MONGODB_URI,
    PORT: process.env.PORT,
    HOST: process.env.HOST,
    JWT_ACCESS_TOKEN_KEY: process.env.JWT_ACCESS_TOKEN_KEY,
    JWT_REFRESH_TOKEN_KEY: process.env.JWT_REFRESH_TOKEN_KEY,
};
