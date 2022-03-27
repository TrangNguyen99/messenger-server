import {NextFunction, Request, Response} from 'express'
import {env} from '../constant/env'
import {ERROR_MESSAGE} from '../constant/error'
import {HTTP_STATUS_CODE} from '../constant/httpStatusCode'
import {SUCCESS_MESSAGE} from '../constant/success'
import {UserModel} from '../model/user.model'
import {resizeAvatar} from '../util/resizeImage'

const getMe = async (req: Request, res: Response, next: NextFunction) => {
  const {userId} = res.locals

  try {
    const user = await UserModel.findById(userId).select('name email avatar')
    res.json({
      type: 'success',
      message: SUCCESS_MESSAGE.SUCCESS,
      data: user,
    })
  } catch (error) {
    next(error)
  }
}

const getOthers = async (req: Request, res: Response, next: NextFunction) => {
  const {userId} = res.locals

  try {
    const users = await UserModel.find({_id: {$ne: userId}}).select(
      'name avatar',
    )
    res.json({
      type: 'success',
      message: SUCCESS_MESSAGE.SUCCESS,
      data: users,
    })
  } catch (error) {
    next(error)
  }
}

const getPublicUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    data: {userId},
  } = res.locals

  try {
    const user = await UserModel.findById(userId).select('name avatar')
    if (!user) {
      next({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        message: ERROR_MESSAGE.INCORRECT_USER_ID,
      })
      return
    }
    res.json({
      type: 'success',
      message: SUCCESS_MESSAGE.SUCCESS,
      data: user,
    })
  } catch (error) {
    next(error)
  }
}

const updateFcmToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    userId,
    deviceId,
    data: {fcmToken},
  } = res.locals

  try {
    const user = await UserModel.findOne({
      _id: userId,
      devices: {$elemMatch: {deviceId}},
    })
    if (!user) {
      next({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        message: ERROR_MESSAGE.INCORRECT_ACCESS_TOKEN,
      })
      return
    }

    const deviceIndex = user.devices.findIndex(
      device => device.deviceId === deviceId,
    )
    user.devices[deviceIndex].fcmToken = fcmToken
    await user.save()

    res.json({
      type: 'success',
      message: SUCCESS_MESSAGE.SUCCESS,
      data: null,
    })
  } catch (error) {
    next(error)
  }
}

const updateAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {userId} = res.locals

  try {
    if (!req.file) {
      next({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        message: ERROR_MESSAGE.MISSING_AVATAR,
      })
      return
    }

    const fileName = await resizeAvatar(req.file.buffer, next)
    if (!fileName) {
      return
    }

    const avatarUrl = `http://${env.HOST}:${env.PORT}/image/avatar/${fileName}`
    await UserModel.findByIdAndUpdate(userId, {
      avatar: avatarUrl,
    })
    res.json({
      type: 'success',
      message: SUCCESS_MESSAGE.SUCCESS,
      data: {
        avatar: avatarUrl,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const userController = {
  getMe,
  getOthers,
  getPublicUser,
  updateFcmToken,
  updateAvatar,
}
