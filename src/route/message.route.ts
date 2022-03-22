import express from 'express'
import {messageController} from '../controller/message.controller'
import {verifyAccessToken} from '../middleware/verifyAccessToken'
import {messageValidation} from '../validation/message.validation'

const router = express.Router()

router.get(
  '/conversation/:conversationId',
  messageValidation.getMessages,
  verifyAccessToken,
  messageController.getMessages,
)
router.post(
  '/',
  messageValidation.createMessage,
  verifyAccessToken,
  messageController.createMessage,
)

export const messageRoute = router
