import {NextFunction, Request, Response} from 'express'
import Joi from 'joi'
import {HTTP_STATUS_CODE} from '../constant/httpStatusCode'

const getMe = async (req: Request, res: Response, next: NextFunction) => {
  const condition = Joi.object({})

  try {
    await condition.validateAsync(req.body, {abortEarly: false})
    next()
  } catch (error: any) {
    next({
      status: HTTP_STATUS_CODE.BAD_REQUEST,
      message: error.message,
    })
  }
}

const getAllOtherUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const condition = Joi.object({})

  try {
    await condition.validateAsync(req.body, {abortEarly: false})
    next()
  } catch (error: any) {
    next({
      status: HTTP_STATUS_CODE.BAD_REQUEST,
      message: error.message,
    })
  }
}

const updateFcmToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const condition = Joi.object({
    fcmToken: Joi.string().required(),
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

export const userValidation = {getMe, getAllOtherUsers, updateFcmToken}
