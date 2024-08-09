import { Router } from 'express'
import {
  addStaffMember,
  deleteStaffMember,
  getAllStaffMembers,
  updateStaffMember,
} from '../controllers/staff.controller'
import authenticateAdmin from '../middlewares/adminAuth.middleware'

const router = Router()

// Admin operations
router.post('/add', authenticateAdmin, addStaffMember)
router.delete('/delete/:staffId', authenticateAdmin, deleteStaffMember)
router.put('/update/:staffId', authenticateAdmin, updateStaffMember)
router.get('/getall', authenticateAdmin, getAllStaffMembers)

export { router as staffRouter }
