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
    const conversation = await ConversationModel.findById(conversationId)
    if (!conversation) {
      next({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        message: ERROR_MESSAGE.BAD_REQUEST,
      })
      return
    }

    const userIndex = conversation.participants.findIndex(
      participant => participant.toString() === userId,
    )
    if (userIndex === -1) {
      next({
        status: HTTP_STATUS_CODE.UNAUTHORIZED,
        message: ERROR_MESSAGE.INCORRECT_ACCESS_TOKEN,
      })
      return
    }

    const messages = await MessageModel.find({conversationId})
      .select('senderId text createdAt updatedAt')
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
    data: {conversationId, text},
  } = res.locals

  try {
    const conversation = await ConversationModel.findById(conversationId)
    if (!conversation) {
      next({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        message: ERROR_MESSAGE.BAD_REQUEST,
      })
      return
    }

    const userIndex = conversation.participants.findIndex(
      participant => participant.toString() === userId,
    )
    if (userIndex === -1) {
      next({
        status: HTTP_STATUS_CODE.UNAUTHORIZED,
        message: ERROR_MESSAGE.INCORRECT_ACCESS_TOKEN,
      })
      return
    }

    const message = new MessageModel({conversationId, senderId: userId, text})
    await message.save()
    await ConversationModel.findByIdAndUpdate(conversationId, {
      finalMessage: message._id,
    })

    const io = res.locals.io
    const user = await UserModel.findById(userId)
    const partnerIndex = 1 - userIndex
    const partnerId = conversation.participants[partnerIndex].toString()

    io.to(partnerId).emit('private message', {
      from: {
        userId,
        name: user?.name,
      },
      to: {
        conversationId,
      },
      message: {
        _id: message._id,
        text,
        updatedAt: message.updatedAt,
      },
    })

    const partner = await UserModel.findById(partnerId)
    const fcmTokens: string[] = []
    partner?.devices.forEach(d => {
      if (d.fcmToken) {
        fcmTokens.push(d.fcmToken)
      }
    })
    if (fcmTokens.length) {
      admin.messaging().sendMulticast({
        tokens: fcmTokens,
        notification: {
          title: user?.name,
          body: text,
        },
        android: {
          notification: {
            channelId: 'default',
          },
        },
      })
    }

    res.json({
      type: 'success',
      message: SUCCESS_MESSAGE.SUCCESS,
      data: {
        _id: message._id,
        senderId: userId,
        text: message.text,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const messageController = {
  getMessages,
  createMessage,
}
