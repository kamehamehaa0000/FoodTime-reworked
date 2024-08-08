import { Router } from 'express'
import authenticateAdmin from '../middlewares/adminAuth.middleware.js'
import { updateTotalSlots } from '../controllers/restaurant.controller.js'

const router = Router()

router
  .route('/totalslots/:newSlotNumber')
  .post(authenticateAdmin, updateTotalSlots)

export { router as restaurantRouter }
