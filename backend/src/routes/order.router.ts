import express from 'express'
import {
  createOrder,
  completeOrder,
  getOrder,
  getAllUserOrder,
  getAllOrders,
} from '../controllers/order.controller'
import authenticate from '../middlewares/userAuth.middleware'
import authenticateAdmin from '../middlewares/adminAuth.middleware'

const router = express.Router()

router.get('/orderbyid/:id', authenticateAdmin, getOrder)
router.get('/userorders', authenticate, getAllUserOrder)
router.get('/allorders', authenticateAdmin, getAllOrders)
router.post('/create', authenticate, createOrder)
router.post('/complete', authenticate, completeOrder)

export { router as orderRouter }
