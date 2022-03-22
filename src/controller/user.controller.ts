import {NextFunction, Request, Response} from 'express'
import {ERROR_MESSAGE} from '../constant/error'
import {HTTP_STATUS_CODE} from '../constant/httpStatusCode'
import {SUCCESS_MESSAGE} from '../constant/success'
import {UserModel} from '../model/user.model'

const getMe = async (req: Request, res: Response, next: NextFunction) => {
  const {userId} = res.locals

  try {
    const users = await UserModel.findById(userId).select('name')
    res.json({
      type: 'success',
      message: SUCCESS_MESSAGE.SUCCESS,
      data: users,
    })
  } catch (error) {
    next(error)
  }
}

const getAllOtherUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {userId} = res.locals

  try {
    const users = await UserModel.find({_id: {$ne: userId}}).select('name')
    res.json({
      type: 'success',
      message: SUCCESS_MESSAGE.SUCCESS,
      data: users,
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
    const user = await UserModel.findById(userId)
    if (!user) {
      next({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        message: ERROR_MESSAGE.BAD_REQUEST,
      })
      return
    }

    const deviceIndex = user.devices.findIndex(d => d.deviceId === deviceId)
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

export const userController = {getMe, getAllOtherUsers, updateFcmToken}
