"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRoute = void 0;
const express_1 = __importDefault(require("express"));
const message_controller_1 = require("../controller/message.controller");
const verifyAccessToken_1 = require("../middleware/verifyAccessToken");
const message_validation_1 = require("../validation/message.validation");
const router = express_1.default.Router();
router.get('/conversation/:conversationId', message_validation_1.messageValidation.getMessages, verifyAccessToken_1.verifyAccessToken, message_controller_1.messageController.getMessages);
router.post('/conversation/:conversationId', message_validation_1.messageValidation.createMessage, verifyAccessToken_1.verifyAccessToken, message_controller_1.messageController.createMessage);
exports.messageRoute = router;
