import express from 'express';
const router = express.Router()
import { getProducts, getProductById, deleteProduct, addProduct ,updateProduct, createProductReview, getTopProducts } from '../controllers/productController.js'
import { protect, admin } from '../middleware/authMiddleware.js';


router.route('/')
      .get(getProducts)
      .post(protect, admin, addProduct)
//router.route('/:keyword/page/:pageNumber')
//router.route('/page/:pageNumber')
router.get('/top', getTopProducts)      
router.route('/:id/reviews').post(protect, createProductReview)
router.route('/:id')
      .get(getProductById)
      .delete(protect, admin, deleteProduct)
      .put(protect, admin, updateProduct)
      
export default router