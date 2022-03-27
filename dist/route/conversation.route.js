"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversationRoute = void 0;
const express_1 = __importDefault(require("express"));
const conversation_controller_1 = require("../controller/conversation.controller");
const verifyAccessToken_1 = require("../middleware/verifyAccessToken");
const conversation_route_1 = require("../validation/conversation.route");
const router = express_1.default.Router();
router.get('/', conversation_route_1.conversationValidation.getConversations, verifyAccessToken_1.verifyAccessToken, conversation_controller_1.conversationController.getConversations);
router.post('/private', conversation_route_1.conversationValidation.createPrivateConversation, verifyAccessToken_1.verifyAccessToken, conversation_controller_1.conversationController.createPrivateConversation);
exports.conversationRoute = router;
