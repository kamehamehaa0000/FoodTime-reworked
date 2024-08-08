import { Router } from 'express'

import authenticate from '../middlewares/userAuth.middleware.js'
import authenticateAdmin from '../middlewares/adminAuth.middleware.js'
import {
  addReservation,
  deleteReservation,
  getAllReservationById,
  getAllReservation,
} from '../controllers/reservation.controller.js'

const router = Router()

router.route('/add').post(authenticate, addReservation)
router.route('/delete/:resID').delete(authenticate, deleteReservation)
router.route('/user').get(authenticate, getAllReservationById)

// Admin operations
router.route('/getall').get(authenticateAdmin, getAllReservation)
router
  .route('/admin/delete/:resID')
  .delete(authenticateAdmin, deleteReservation)

export { router as reservationRouter }
