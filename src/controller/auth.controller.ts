import bcrypt from 'bcryptjs'
import {NextFunction, Request, Response} from 'express'
import {env} from '../constant/env'
import {ERROR_MESSAGE} from '../constant/error'
import {HTTP_STATUS_CODE} from '../constant/httpStatusCode'
import {JWT_EXPIRE_TIME} from '../constant/jwt'
import {SUCCESS_MESSAGE} from '../constant/success'
import {UserModel} from '../model/user.model'
import {generateJwt, verifyJwt} from '../util/jwt'

const register = async (req: Request, res: Response, next: NextFunction) => {
  const {name, email, password} = res.locals.data
  try {
    const countUser = await UserModel.count({email})
    if (countUser) {
      next({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        message: ERROR_MESSAGE.EMAIL_ALREADY_EXISTS,
      })
      return
    }

    const hashPassword = bcrypt.hashSync(password)
    const user = new UserModel({name, email, password: hashPassword})
    await user.save()

    res.status(HTTP_STATUS_CODE.CREATED).json({
      type: 'success',
      message: SUCCESS_MESSAGE.REGISTER_SUCCESS,
      data: null,
    })
  } catch (error) {
    next(error)
  }
}

const login = async (req: Request, res: Response, next: NextFunction) => {
  const {email, password, deviceId, platform} = res.locals.data

  try {
    const user = await UserModel.findOne({email})
    if (!user) {
      next({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        message: ERROR_MESSAGE.EMAIL_DOES_NOT_EXIST,
      })
      return
    }

    const checkPassword = bcrypt.compareSync(password, user.password)
    if (!checkPassword) {
      next({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        message: ERROR_MESSAGE.INCORRECT_PASSWORD,
      })
      return
    }

    const accessToken = generateJwt(
      {userId: user._id, deviceId},
      `${env.JWT_ACCESS_TOKEN_KEY}`,
      JWT_EXPIRE_TIME.ACCESS_TOKEN,
    )
    const refreshToken = generateJwt(
      {userId: user._id, deviceId},
      `${env.JWT_REFRESH_TOKEN_KEY}`,
      JWT_EXPIRE_TIME.REFRESH_TOKEN,
    )

    const deviceIndex = user.devices.findIndex(
      device => device.deviceId === deviceId,
    )
    if (deviceIndex !== -1) {
      user.devices[deviceIndex].refreshToken = refreshToken
    } else {
      user.devices.push({deviceId, platform, refreshToken})
    }
    await user.save()

    res.json({
      type: 'success',
      message: SUCCESS_MESSAGE.LOGIN_SUCCESS,
      data: {accessToken, refreshToken},
    })
  } catch (error) {
    next(error)
  }
}

const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {refreshToken} = res.locals.data

  try {
    const data = verifyJwt(refreshToken, `${env.JWT_REFRESH_TOKEN_KEY}`, next)
    if (!data) {
      return
    }

    const {userId, deviceId} = data.data
    const user = await UserModel.findById(userId)
    if (!user) {
      next({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        message: ERROR_MESSAGE.INCORRECT_REFRESH_TOKEN,
      })
      return
    }

    const deviceIndex = user.devices.findIndex(
      device => device.deviceId === deviceId && device.refreshToken,
    )
    if (deviceIndex === -1) {
      next({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        message: ERROR_MESSAGE.INCORRECT_REFRESH_TOKEN,
      })
      return
    }

    const accessToken = generateJwt(
      {userId: user._id, deviceId},
      `${env.JWT_ACCESS_TOKEN_KEY}`,
      JWT_EXPIRE_TIME.ACCESS_TOKEN,
    )
    res.json({
      type: 'success',
      message: SUCCESS_MESSAGE.REFRESH_TOKEN_SUCCESS,
      data: {accessToken},
    })
  } catch (error) {
    next(error)
  }
}

const logout = async (req: Request, res: Response, next: NextFunction) => {
  const {userId, deviceId} = res.locals

  try {
    const user = await UserModel.findById(userId)
    if (user) {
      const deviceIndex = user.devices.findIndex(
        device => device.deviceId === deviceId && device.refreshToken,
      )
      if (deviceIndex !== -1) {
        user.devices[deviceIndex].refreshToken = null
        await user.save()
      }
    }
    res.json({
      type: 'success',
      message: SUCCESS_MESSAGE.LOGOUT_SUCCESS,
      data: null,
    })
  } catch (error) {
    next(error)
  }
}

export const authController = {register, login, refreshToken, logout}
