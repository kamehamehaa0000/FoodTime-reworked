import express from 'express'
import {
  addToCart,
  removeFromCart,
  getCart,
} from '../controllers/cart.controller'
import authenticate from '../middlewares/userAuth.middleware'

const router = express.Router()

router.get('/getcart', authenticate, getCart)
router.post('/add', authenticate, addToCart)
router.post('/remove', authenticate, removeFromCart)

export { router as cartRouter }
