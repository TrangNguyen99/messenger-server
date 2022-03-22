import {NextFunction, Request, Response} from 'express'
import {SUCCESS_MESSAGE} from '../constant/success'
import {ConversationModel} from '../model/conversation.model'

const createPrivateConversation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    userId,
    data: {partnerId},
  } = res.locals

  try {
    const conversation = await ConversationModel.findOne({
      type: 'private',
      $or: [
        {
          participants: [userId, partnerId],
        },
        {
          participants: [partnerId, userId],
        },
      ],
    })
    if (conversation) {
      res.json({
        type: 'success',
        message: SUCCESS_MESSAGE.SUCCESS,
        data: {
          conversationId: conversation._id,
        },
      })
      return
    }

    const newConversation = new ConversationModel({
      participants: [userId, partnerId],
    })
    await newConversation.save()
    res.json({
      type: 'success',
      message: SUCCESS_MESSAGE.SUCCESS,
      data: {
        conversationId: newConversation._id,
      },
    })
  } catch (error) {
    next(error)
  }
}

const getConversations = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {userId} = res.locals

  try {
    const conversations = await ConversationModel.find({
      participants: userId,
      finalMessage: {$ne: null},
    })
      .select('type participants finalMessage')
      .populate('participants', 'name')
      .populate('finalMessage', 'senderId text updatedAt')
    res.json({
      type: 'success',
      message: SUCCESS_MESSAGE.SUCCESS,
      data: conversations,
    })
  } catch (error) {
    next(error)
  }
}

export const conversationController = {
  createPrivateConversation,
  getConversations,
}
