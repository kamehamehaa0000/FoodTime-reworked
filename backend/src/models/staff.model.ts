import { Schema, model } from 'mongoose'

export interface IStaff {
  name: string
  role: string
  shift?: string
  phoneNumber: number
  dateOfJoining: string
}

const staffSchema = new Schema<IStaff>(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    shift: { type: String, default: 'Not Assigned' },
    phoneNumber: { type: Number, required: true, unique: true },
    dateOfJoining: { type: String, required: true },
  },
  { timestamps: true }
)

const Staff = model<IStaff>('Staff', staffSchema)

export default Staff
