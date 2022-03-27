import mongoose, {Schema, Types} from 'mongoose'

interface Message {
  conversationId: Types.ObjectId
  senderId: Types.ObjectId
  receiverId: Types.ObjectId | null
  type: 'text' | 'image'
  text: string | null
  image: string | null
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
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    type: {
      type: String,
      enum: ['text', 'image'],
      default: 'text',
    },
    text: {
      type: String,
      trim: true,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
  },
  {timestamps: true},
)

export const MessageModel = mongoose.model('Message', schema)
