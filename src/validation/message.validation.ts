import {NextFunction, Request, Response} from 'express'
import Joi from 'joi'
import {HTTP_STATUS_CODE} from '../constant/httpStatusCode'

const getMessages = async (req: Request, res: Response, next: NextFunction) => {
  const condition = Joi.object({
    conversationId: Joi.string().required(),
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
  const condition = Joi.object({
    conversationId: Joi.string().required(),
    text: Joi.string().required().trim(),
  })

  try {
    const data = await condition.validateAsync(req.body, {abortEarly: false})
    res.locals.data = data
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
