import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcrypt'

export interface IUser extends Document {
  _id: string
  firstName: string
  lastName: string
  username: string
  password?: string
  avatar: string
  email: string
  faceDescriptors?: any
  googleId?: string
  isPasswordCorrect: (password: string) => Promise<boolean>
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, min: [1, 'Name too short.'] },
    lastName: { type: String, min: [1, 'Name too short.'] },
    username: {
      type: String,
      min: [4, 'Username is too short.'],
      required: true,
      unique: true,
    },
    password: {
      type: String,
      min: [8, 'Min length of password should be 8.'],
      max: [40, 'Max length of password should be 40.'],
      validate: {
        validator: function (value: string) {
          return this.googleId || value != null
        },
        message: 'Password is required for traditional signups.',
      },
    },
    avatar: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    googleId: { type: String },
  },
  { timestamps: true }
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next()
  }
  try {
    console.log('Hashing password before saving...')
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    console.log('Password hashed:', this.password)
    next()
  } catch (err: any) {
    next(err)
  }
})

userSchema.methods.isPasswordCorrect = async function (password: string) {
  if (!this.password) {
    return false
  }
  console.log(
    'Comparing password:',
    password,
    'with hashed password:',
    this.password
  )
  const isMatch = await bcrypt.compare(password, this.password)
  console.log('Password comparison result:', isMatch)
  return isMatch
}

const User = mongoose.model<IUser>('User', userSchema)

export { User }
