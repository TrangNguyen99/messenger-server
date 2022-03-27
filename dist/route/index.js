"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("./auth.route");
const conversation_route_1 = require("./conversation.route");
const message_route_1 = require("./message.route");
const user_route_1 = require("./user.route");
const router = express_1.default.Router();
router.use('/auth', auth_route_1.authRoute);
router.use('/users', user_route_1.userRoute);
router.use('/conversations', conversation_route_1.conversationRoute);
router.use('/messages', message_route_1.messageRoute);
exports.api = router;
