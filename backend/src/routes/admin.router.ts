import express from 'express'
import { loginAdmin, updateAdmin } from '../controllers/admin.controller'
import authenticateAdmin from '../middlewares/adminAuth.middleware'

const router = express.Router()

router.put('/update', authenticateAdmin, updateAdmin)
router.post('/login', loginAdmin)

export default router
