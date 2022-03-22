import {NextFunction, Request, Response} from 'express'
import Joi from 'joi'
import {HTTP_STATUS_CODE} from '../constant/httpStatusCode'

const register = async (req: Request, res: Response, next: NextFunction) => {
  const condition = Joi.object({
    name: Joi.string().required().trim().min(2).max(20),
    email: Joi.string().required().trim().email(),
    password: Joi.string().required().min(6).max(20),
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

const login = async (req: Request, res: Response, next: NextFunction) => {
  const condition = Joi.object({
    email: Joi.string().required().trim().email(),
    password: Joi.string().required().min(6).max(20),
    deviceId: Joi.string().required().trim(),
    platform: Joi.string().required().valid('android', 'ios'),
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

const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const condition = Joi.object({
    refreshToken: Joi.string().required(),
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

const logout = async (req: Request, res: Response, next: NextFunction) => {
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

export const authValidation = {register, login, refreshToken, logout}
