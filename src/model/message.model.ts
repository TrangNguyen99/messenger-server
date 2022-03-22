import mongoose, {Schema, Types} from 'mongoose'

interface Message {
  conversationId: Types.ObjectId
  senderId: Types.ObjectId
  text: string
  createdAt: Date
  updatedAt: Date
}

const schema = new Schema<Message>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      trim: true,
    },
  },
  {timestamps: true},
)

export const MessageModel = mongoose.model('Message', schema)
