import {NextFunction, Request, Response} from 'express'
import Joi from 'joi'
import {HTTP_STATUS_CODE} from '../constant/httpStatusCode'

const getMessages = async (req: Request, res: Response, next: NextFunction) => {
  const condition = Joi.object({
    conversationId: Joi.string()
      .required()
      .regex(/^[0-9a-fA-F]{24}$/),
  })

  try {
    const data = await condition.validateAsync(req.params, {abortEarly: false})
    res.locals.data = data
    next()
  } catch (error: any) {
    next({
      status: HTTP_STATUS_CODE.BAD_REQUEST,
      message: error.message,
    })
  }
}

const createMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const condition1 = Joi.object({
    conversationId: Joi.string()
      .required()
      .regex(/^[0-9a-fA-F]{24}$/),
  })
  const condition2 = Joi.object({
    receiverId: Joi.string()
      .required()
      .regex(/^[0-9a-fA-F]{24}$/),
    text: Joi.string().trim(),
  })

  try {
    const data1 = await condition1.validateAsync(req.params, {
      abortEarly: false,
    })
    const data2 = await condition2.validateAsync(req.body, {
      abortEarly: false,
    })
    res.locals.data = {...data1, ...data2}
    next()
  } catch (error: any) {
    next({
      status: HTTP_STATUS_CODE.BAD_REQUEST,
      message: error.message,
    })
  }
}

export const messageValidation = {
  getMessages,
  createMessage,
}
