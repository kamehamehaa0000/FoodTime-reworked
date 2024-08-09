import express from 'express'
import { loginAdmin, updateAdmin } from '../controllers/admin.controller'
import authenticateAdmin from '../middlewares/adminAuth.middleware'
import { userLogout } from '../controllers/admin.controller'
import { checkAuth } from '../controllers/admin.controller'

const router = express.Router()

router.put('/update', authenticateAdmin, updateAdmin)
router.post('/login', loginAdmin)
router.post('/logout', userLogout)
router.get('/check-auth', checkAuth)

export default router
