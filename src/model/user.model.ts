import mongoose, {Schema, Types} from 'mongoose'

interface Device {
  deviceId: string
  platform: 'android' | 'ios'
  refreshToken: string | null
  fcmToken: string | null
}

const deviceSchema = new Schema<Device>({
  deviceId: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    required: true,
    enum: ['android', 'ios'],
  },
  refreshToken: {
    type: String,
    default: null,
  },
  fcmToken: {
    type: String,
    default: null,
  },
})

interface User {
  name: string
  email: string
  avatar: string | null
  password: string
  devices: Types.DocumentArray<Device>
}

const userSchema = new Schema<User>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: true,
    },
    devices: {
      type: [deviceSchema],
      default: <any>[],
    },
  },
  {timestamps: true},
)

export const UserModel = mongoose.model('User', userSchema)
