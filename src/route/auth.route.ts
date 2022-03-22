import express from 'express'
import {authController} from '../controller/auth.controller'
import {verifyAccessToken} from '../middleware/verifyAccessToken'
import {authValidation} from '../validation/auth.validation'

const router = express.Router()

router.post('/register', authValidation.register, authController.register)
router.post('/login', authValidation.login, authController.login)
router.post(
  '/refresh-token',
  authValidation.refreshToken,
  authController.refreshToken,
)
router.delete(
  '/logout',
  authValidation.logout,
  verifyAccessToken,
  authController.logout,
)

export const authRoute = router
