// models/admin.model.ts
import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcrypt'

export interface IAdmin extends Document {
  username: string
  password: string
  isPasswordCorrect(password: string): Promise<boolean>
}

const adminSchema = new Schema<IAdmin>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)
adminSchema.pre<IAdmin>('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})
adminSchema.methods.isPasswordCorrect = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password)
}
const Admin = mongoose.model<IAdmin>('Admin', adminSchema)

export { Admin }
