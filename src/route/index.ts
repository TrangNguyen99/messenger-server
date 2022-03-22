import express from 'express'
import {authRoute} from './auth.route'
import {conversationRoute} from './conversation.route'
import {messageRoute} from './message.route'
import {userRoute} from './user.route'

const router = express.Router()

router.use('/auth', authRoute)
router.use('/users', userRoute)
router.use('/conversations', conversationRoute)
router.use('/messages', messageRoute)

export const api = router
