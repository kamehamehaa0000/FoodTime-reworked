import mongoose, { Schema, Document } from 'mongoose'

export interface IProduct extends Document {
  name: string
  description: string
  price: number
  category: string
  imageUrl: string
  offerPercentage: number
  available: boolean
  inMenu: boolean
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      min: [3, 'Name is too short.'],
      max: [100, 'Name is too long.'],
    },
    description: {
      type: String,
      required: true,
      min: [10, 'Description is too short.'],
      max: [1000, 'Description is too long.'],
    },

    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative.'],
    },
    category: {
      type: String,
      required: true,
      default: 'All',
      min: [3, 'Category is too short.'],
      max: [50, 'Category is too long.'],
    },
    imageUrl: {
      type: String,
      required: true,
    },

    offerPercentage: { type: Number, default: 0 },
    available: { type: Boolean, default: true },
    inMenu: { type: Boolean, default: true },
  },
  { timestamps: true }
)

const Product = mongoose.model<IProduct>('Product', productSchema)

export { Product }
