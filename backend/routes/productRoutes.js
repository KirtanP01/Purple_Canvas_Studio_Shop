import express from 'express';
import asyncHandler from 'express-async-handler'
const router = express.Router()
import Product from '../models/productModel.js'

// description: Fetch all products
// route: GET /api/products
// access: Public
router.get('/', asyncHandler( async (req, res) => {
    const products = await Product.find({})
    // Just testing
    //res.status(401)
    //throw new Error('Not Authorized')
    res.json(products)
}))

// description: Fetch a single product based on id
// route: GET /api/products/:id
// access: Public
router.get('/:id', asyncHandler( async (req, res) => {
    //const { id } = useParams();
    const product = await Product.findById(req.params.id)
    if(product){
        res.json(product)
    } else{
        res.status(404)
        throw new Error('Product not found')
    }
}))

export default router