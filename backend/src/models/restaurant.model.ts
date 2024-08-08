import mongoose from 'mongoose'
export interface IRestaurant extends Document {
  _id: string
  totalSlots: number
  bookedSlots: number
}
const restaurantSchema = new mongoose.Schema<IRestaurant>(
  {
    totalSlots: { type: Number, required: true, default: 10 },
    bookedSlots: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
)

const Restaurant = mongoose.model('Restaurant', restaurantSchema)

export default Restaurant
