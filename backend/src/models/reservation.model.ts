import mongoose, { Document, Schema } from 'mongoose'

interface IReservation extends Document {
  time: string
  date: string
  madeBy: mongoose.Schema.Types.ObjectId
  phoneNumber: number
  heads: string
}

const reservationSchema: Schema = new Schema(
  {
    time: { type: String, required: true },
    date: { type: String, required: true },
    madeBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    heads: { type: String, required: true },
  },
  { timestamps: true }
)

const Reservation = mongoose.model<IReservation>(
  'Reservation',
  reservationSchema
)

export default Reservation
