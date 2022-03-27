import {NextFunction, Request, Response} from 'express'
import {env} from '../constant/env'
import {ERROR_MESSAGE} from '../constant/error'
import {HTTP_STATUS_CODE} from '../constant/httpStatusCode'
import {verifyJwt} from '../util/jwt'

export const verifyAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const headerToken = req.headers.authorization
  if (!headerToken) {
    next({
      status: HTTP_STATUS_CODE.UNAUTHORIZED,
      message: ERROR_MESSAGE.MISSING_AUTH_HEADER,
    })
    return
  }

  const accessToken = headerToken.split('Bearer ')[1]
  if (!accessToken) {
    next({
      status: HTTP_STATUS_CODE.UNAUTHORIZED,
      message: ERROR_MESSAGE.MISSING_ACCESS_TOKEN,
    })
    return
  }

  const data = verifyJwt(accessToken, `${env.JWT_ACCESS_TOKEN_KEY}`, next)
  if (!data) {
    return
  }

  res.locals.userId = data.data.userId
  res.locals.deviceId = data.data.deviceId
  res.locals.name = data.data.name
  res.locals.avatar = data.data.avatar
  next()
}
