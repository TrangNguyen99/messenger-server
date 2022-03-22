import express from 'express'
import {conversationController} from '../controller/conversation.controller'
import {verifyAccessToken} from '../middleware/verifyAccessToken'
import {conversationValidation} from '../validation/conversation.route'

const router = express.Router()

router.post(
  '/private',
  conversationValidation.createPrivateConversation,
  verifyAccessToken,
  conversationController.createPrivateConversation,
)
router.get(
  '/',
  conversationValidation.getConversations,
  verifyAccessToken,
  conversationController.getConversations,
)

export const conversationRoute = router
