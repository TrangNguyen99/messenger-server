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
exports.conversationController = void 0;
const success_1 = require("../constant/success");
const conversation_model_1 = require("../model/conversation.model");
const getConversations = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = res.locals;
    try {
        const conversations = yield conversation_model_1.ConversationModel.find({
            participants: userId,
            finalMessage: { $ne: null },
        })
            .select('type participants finalMessage')
            .populate('participants', 'name avatar')
            .populate('finalMessage', 'senderId receiverId type text image updatedAt');
        res.json({
            type: 'success',
            message: success_1.SUCCESS_MESSAGE.SUCCESS,
            data: conversations,
        });
    }
    catch (error) {
        next(error);
    }
});
const createPrivateConversation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, data: { partnerId }, } = res.locals;
    try {
        const participants = userId.localeCompare(partnerId) === -1
            ? [userId, partnerId]
            : [partnerId, userId];
        const conversation = yield conversation_model_1.ConversationModel.findOne({
            type: 'private',
            participants,
        });
        if (conversation) {
            res.json({
                type: 'success',
                message: success_1.SUCCESS_MESSAGE.SUCCESS,
                data: {
                    conversationId: conversation._id,
                },
            });
            return;
        }
        const newConversation = new conversation_model_1.ConversationModel({ participants });
        yield newConversation.save();
        res.json({
            type: 'success',
            message: success_1.SUCCESS_MESSAGE.SUCCESS,
            data: {
                conversationId: newConversation._id,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.conversationController = {
    getConversations,
    createPrivateConversation,
};
