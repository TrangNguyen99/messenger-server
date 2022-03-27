import multer from 'multer'

export const uploadAvatar = multer({
  limits: {
    fileSize: 1 * 1024 * 1024,
  },
})
