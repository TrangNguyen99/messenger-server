import express from 'express'
import {userController} from '../controller/user.controller'
import {uploadAvatar} from '../middleware/uploadAvatar'
import {verifyAccessToken} from '../middleware/verifyAccessToken'
import {userValidation} from '../validation/user.validation'

const router = express.Router()

router.get('/me', userValidation.getMe, verifyAccessToken, userController.getMe)
router.get(
  '/others',
  userValidation.getOthers,
  verifyAccessToken,
  userController.getOthers,
)
router.get(
  '/public/:userId',
  userValidation.getPublicUser,
  userController.getPublicUser,
)
router.patch(
  '/fcm',
  userValidation.updateFcmToken,
  verifyAccessToken,
  userController.updateFcmToken,
)
router.patch(
  '/avatar',
  userValidation.updateAvatar,
  verifyAccessToken,
  uploadAvatar.single('avatar'),
  userController.updateAvatar,
)

export const userRoute = router
