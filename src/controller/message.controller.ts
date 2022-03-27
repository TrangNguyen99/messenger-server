import {NextFunction, Request, Response} from 'express'
import admin from 'firebase-admin'
import {ERROR_MESSAGE} from '../constant/error'
import {HTTP_STATUS_CODE} from '../constant/httpStatusCode'
import {SUCCESS_MESSAGE} from '../constant/success'
import {ConversationModel} from '../model/conversation.model'
import {MessageModel} from '../model/message.model'
import {UserModel} from '../model/user.model'

const getMessages = async (req: Request, res: Response, next: NextFunction) => {
  const {
    userId,
    data: {conversationId},
  } = res.locals

  try {
    const conversation = await ConversationModel.findOne({
      _id: conversationId,
      participants: userId,
    })
    if (!conversation) {
      next({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        message: ERROR_MESSAGE.INCORRECT_CONVERSATION_ID,
      })
      return
    }

    const messages = await MessageModel.find({conversationId})
      .select('senderId receiverId type text image createdAt updatedAt')
      .sort({createdAt: -1})
    res.json({
      type: 'success',
      message: SUCCESS_MESSAGE.SUCCESS,
      data: messages,
    })
  } catch (error) {
    next(error)
  }
}

const createMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    userId,
    name,
    avatar,
    data: {conversationId, receiverId, text},
  } = res.locals

  try {
    const participants =
      userId.localeCompare(receiverId) === -1
        ? [userId, receiverId]
        : [receiverId, userId]
    const conversation = await ConversationModel.findOne({
      _id: conversationId,
      participants,
    })
    if (!conversation) {
      next({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        message: ERROR_MESSAGE.INCORRECT_CONVERSATION_ID_RECEIVER_ID,
      })
      return
    }

    const message = new MessageModel({
      conversationId,
      senderId: userId,
      receiverId,
      text,
    })
    await message.save()

    res.status(HTTP_STATUS_CODE.CREATED).json({
      type: 'success',
      message: SUCCESS_MESSAGE.SUCCESS,
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
    })

    await ConversationModel.findByIdAndUpdate(conversationId, {
      finalMessage: message._id,
    })

    const io = res.locals.io
    io.to(receiverId).emit('private message', {
      from: {
        _id: userId,
        name,
        avatar,
      },
      to: {partner: {_id: receiverId}, conversationId},
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
    })

    const receiver = await UserModel.findById(receiverId)
    const fcmTokens: string[] = []
    receiver?.devices.forEach(device => {
      if (device.fcmToken) {
        fcmTokens.push(device.fcmToken)
      }
    })
    if (fcmTokens.length) {
      admin.messaging().sendMulticast({
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
      })
    }
  } catch (error) {
    next(error)
  }
}

export const messageController = {
  getMessages,
  createMessage,
}
