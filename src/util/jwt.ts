import {NextFunction} from 'express'
import jwt from 'jsonwebtoken'
import {HTTP_STATUS_CODE} from '../constant/httpStatusCode'

export const generateJwt = (data: any, key: string, expiresIn: string) => {
  return jwt.sign({data}, key, {expiresIn})
}

export const verifyJwt = (
  token: string,
  key: string,
  next: NextFunction,
): any => {
  try {
    const res = jwt.verify(token, key)
    return res
  } catch (error: any) {
    next({
      status: HTTP_STATUS_CODE.BAD_REQUEST,
      message: error.message,
    })
  }
}
