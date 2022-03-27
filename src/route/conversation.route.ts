import express from 'express'
import {conversationController} from '../controller/conversation.controller'
import {verifyAccessToken} from '../middleware/verifyAccessToken'
import {conversationValidation} from '../validation/conversation.route'

const router = express.Router()

router.get(
  '/',
  conversationValidation.getConversations,
  verifyAccessToken,
  conversationController.getConversations,
)
router.post(
  '/private',
  conversationValidation.createPrivateConversation,
  verifyAccessToken,
  conversationController.createPrivateConversation,
)

export const conversationRoute = router
