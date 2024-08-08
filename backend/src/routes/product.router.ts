import express from 'express'
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  searchProducts,
  getProducts,
  getAllCategories,
  getMenuItemsPaginated,
  changeInMenuStatus,
} from '../controllers/product.controller'
import authenticate from '../middlewares/userAuth.middleware'
import upload from '../config/multer'

const router = express.Router()
router.get('/products/filter', getProducts)
router.get('/categories', getAllCategories)
router.get('/products', getAllProducts)
router.get('/search', searchProducts)
router.get('/:id', getProductById)
router.post(
  '/create',
  authenticate,
  upload.single('productImage'),
  createProduct
)
router.put(
  '/update/:productId',
  authenticate,
  upload.single('productImage'),
  updateProduct
)
router.delete('/delete/:productId', authenticate, deleteProduct)
// router.get('/menu/all', authenticate, getAllMenuItems)
router.get('/menu/filter', authenticate, getMenuItemsPaginated)
router.put('/menu/status/:productId', authenticate, changeInMenuStatus)
export { router as productRouter }
