import express from 'express'
import {
  createOrder,
  completeOrder,
  getOrder,
  getAllUserOrder,
  getAllOrders,
} from '../controllers/order.controller'
import authenticate from '../middlewares/userAuth.middleware'

const router = express.Router()

router.get('/orderbyid/:id', authenticate, getOrder)
router.get('/userorders', authenticate, getAllUserOrder)
router.get('/allorders', authenticate, getAllOrders)
router.post('/create', authenticate, createOrder)
router.post('/complete', authenticate, completeOrder)

export { router as orderRouter }
