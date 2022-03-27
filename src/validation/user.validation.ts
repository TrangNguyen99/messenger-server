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

const getOthers = async (req: Request, res: Response, next: NextFunction) => {
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

const getPublicUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const condition1 = Joi.object({})
  const condition2 = Joi.object({
    userId: Joi.string()
      .required()
      .regex(/^[0-9a-fA-F]{24}$/),
  })

  try {
    await condition1.validateAsync(req.body, {abortEarly: false})
    const data = await condition2.validateAsync(req.params, {abortEarly: false})
    res.locals.data = data
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

const updateAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const condition = Joi.object({})
    await condition.validateAsync(req.body, {abortEarly: false})
    next()
  } catch (error: any) {
    next({
      status: HTTP_STATUS_CODE.BAD_REQUEST,
      message: error.message,
    })
  }
}

export const userValidation = {
  getMe,
  getOthers,
  getPublicUser,
  updateFcmToken,
  updateAvatar,
}
