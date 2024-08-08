import mongoose, { Schema, Document, Types } from 'mongoose'

export interface ICartItem {
  product: Types.ObjectId
  quantity: number
}

export interface ICart extends Document {
  user: Types.ObjectId
  items: ICartItem[]
}

const cartItemSchema = new Schema<ICartItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
})

const cartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [cartItemSchema],
  },
  { timestamps: true }
)

const Cart = mongoose.model<ICart>('Cart', cartSchema)

export { Cart }
