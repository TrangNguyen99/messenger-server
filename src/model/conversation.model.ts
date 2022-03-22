import mongoose, {Schema, Types} from 'mongoose'

interface Conversation {
  type: 'private' | 'group'
  participants: Types.ObjectId[]
  finalMessage: Types.ObjectId | null
}

const schema = new Schema<Conversation>(
  {
    type: {
      type: String,
      required: true,
      enum: ['private', 'group'],
      default: 'private',
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    finalMessage: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },
  },
  {timestamps: true},
)

export const ConversationModel = mongoose.model('Conversation', schema)
