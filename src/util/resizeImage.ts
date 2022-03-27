import {NextFunction} from 'express'
import path from 'path'
import sharp from 'sharp'
import {HTTP_STATUS_CODE} from '../constant/httpStatusCode'

export const resizeAvatar = async (buffer: Buffer, next: NextFunction) => {
  try {
    const folder = path.join(__dirname, '../../public/image/avatar')
    const fileName = Date.now() + '-' + Math.round(Math.random() * 1e9) + '.jpg'
    const filePath = path.resolve(`${folder}/${fileName}`)

    await sharp(buffer).resize(300, 300).toFile(filePath)

    return fileName
  } catch (error: any) {
    next({
      status: HTTP_STATUS_CODE.BAD_REQUEST,
      message: error.message,
    })
  }
}
