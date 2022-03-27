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
exports.messageController = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const error_1 = require("../constant/error");
const httpStatusCode_1 = require("../constant/httpStatusCode");
const success_1 = require("../constant/success");
const conversation_model_1 = require("../model/conversation.model");
const message_model_1 = require("../model/message.model");
const user_model_1 = require("../model/user.model");
const getMessages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, data: { conversationId }, } = res.locals;
    try {
        const conversation = yield conversation_model_1.ConversationModel.findOne({
            _id: conversationId,
            participants: userId,
        });
        if (!conversation) {
            next({
                status: httpStatusCode_1.HTTP_STATUS_CODE.BAD_REQUEST,
                message: error_1.ERROR_MESSAGE.INCORRECT_CONVERSATION_ID,
            });
            return;
        }
        const messages = yield message_model_1.MessageModel.find({ conversationId })
            .select('senderId receiverId type text image createdAt updatedAt')
            .sort({ createdAt: -1 });
        res.json({
            type: 'success',
            message: success_1.SUCCESS_MESSAGE.SUCCESS,
            data: messages,
        });
    }
    catch (error) {
        next(error);
    }
});
const createMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, name, avatar, data: { conversationId, receiverId, text }, } = res.locals;
    try {
        const participants = userId.localeCompare(receiverId) === -1
            ? [userId, receiverId]
            : [receiverId, userId];
        const conversation = yield conversation_model_1.ConversationModel.findOne({
            _id: conversationId,
            participants,
        });
        if (!conversation) {
            next({
                status: httpStatusCode_1.HTTP_STATUS_CODE.BAD_REQUEST,
                message: error_1.ERROR_MESSAGE.INCORRECT_CONVERSATION_ID_RECEIVER_ID,
            });
            return;
        }
        const message = new message_model_1.MessageModel({
            conversationId,
            senderId: userId,
            receiverId,
            text,
        });
        yield message.save();
        res.status(httpStatusCode_1.HTTP_STATUS_CODE.CREATED).json({
            type: 'success',
            message: success_1.SUCCESS_MESSAGE.SUCCESS,
            data: {
                _id: message._id,
                senderId: userId,
                receiverId,
                type: 'text',
                text,
                image: null,
                createdAt: message.createdAt,
                updatedAt: message.updatedAt,
            },
        });
        yield conversation_model_1.ConversationModel.findByIdAndUpdate(conversationId, {
            finalMessage: message._id,
        });
        const io = res.locals.io;
        io.to(receiverId).emit('private message', {
            from: {
                _id: userId,
                name,
                avatar,
            },
            to: { partner: { _id: receiverId }, conversationId },
            message: {
                _id: message._id,
                senderId: userId,
                receiverId,
                type: 'text',
                text,
                image: null,
                createdAt: message.createdAt,
                updatedAt: message.updatedAt,
            },
        });
        const receiver = yield user_model_1.UserModel.findById(receiverId);
        const fcmTokens = [];
        receiver === null || receiver === void 0 ? void 0 : receiver.devices.forEach(device => {
            if (device.fcmToken) {
                fcmTokens.push(device.fcmToken);
            }
        });
        if (fcmTokens.length) {
            firebase_admin_1.default.messaging().sendMulticast({
                tokens: fcmTokens,
                notification: {
                    title: name,
                    body: text,
                },
                android: {
                    notification: {
                        channelId: 'default',
                        icon: 'ic_notifee_small_icon',
                        sound: 'sound',
                    },
                },
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.messageController = {
    getMessages,
    createMessage,
};
