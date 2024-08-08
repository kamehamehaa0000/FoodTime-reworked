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

const Admin = mongoose.model<IAdmin>('Admin', adminSchema)

export { Admin }
