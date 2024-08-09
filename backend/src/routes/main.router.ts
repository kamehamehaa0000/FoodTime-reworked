import express from 'express'
import userRouter from './user.router'
import { productRouter } from './product.router'
import { cartRouter } from './cart.router'
import { orderRouter } from './order.router'
import adminRouter from './admin.router'
import { restaurantRouter } from './restuarant.router'
import { reservationRouter } from './reservation.router'
import { staffRouter } from './staff.router'
const router = express.Router()
router.use('/user', userRouter)
router.use('/product', productRouter)
router.use('/cart', cartRouter)
router.use('/order', orderRouter)
router.use('/admin', adminRouter)
router.use('/restaurant', restaurantRouter)
router.use('/reservation', reservationRouter)
router.use('/staff', staffRouter)
export { router as mainRouter }
