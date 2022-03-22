import express from 'express'
import {userController} from '../controller/user.controller'
import {verifyAccessToken} from '../middleware/verifyAccessToken'
import {userValidation} from '../validation/user.validation'

const router = express.Router()

router.get('/me', userValidation.getMe, verifyAccessToken, userController.getMe)
router.get(
  '/get-all-other-users',
  userValidation.getAllOtherUsers,
  verifyAccessToken,
  userController.getAllOtherUsers,
)
router.post(
  '/fcm',
  userValidation.updateFcmToken,
  verifyAccessToken,
  userController.updateFcmToken,
)

export const userRoute = router
