import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

// description: Fetch all products
// route: GET /api/products
// access: Public
const getProducts = asyncHandler(async(req, res) => {
    const products = await Product.find({})

    res.json(products)
})

// description: Fetch a single product based on id
// route: GET /api/products/:id
// access: Public
const getProductById = asyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id)
    if(product){
        res.json(product)
    } else{
        res.status(404)
        throw new Error('Product not found')
    }
})

// description: Delete a single product based on id
// route: DELETE /api/products/:id
// access: Private/Admin
const deleteProduct = asyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id)
    if(product){
        await product.remove()
        res.json({ message:'Product removed successfully' })
    } else{
        res.status(404)
        throw new Error('Product not found')
    }
})

// description: Add a single product 
// route: POST /api/products/
// access: Private/Admin
const addProduct = asyncHandler(async(req, res) => {
    const product = new Product({
        name: 'Test Product',
        price: 0,
        user: req.user._id,
        image: '/public/images/sample.jpg',
        brand: 'Sample Brand',
        size: 'Medium',
        category: 'Sample Category',
        quantityInStock: 0,
        numReviews: 0,
        description: 'Sample Description'
    })

    const addedProduct = await product.save()
    res.status(201).json(addedProduct)
})

// description: Update a single product 
// route: PUT /api/products/:id
// access: Private/Admin
const updateProduct = asyncHandler(async(req, res) => {
    const {name, price, description,image, brand, size, category,quantityInStock, } = req.body

    const product = await Product.findById(req.params.id)
    product.name = name
    product.price = price
    product.description = description
    product.image = image
    product.brand = brand
    product.size = size
    product.category = category
    product.quantityInStock = quantityInStock

    if(product){
        const updatedProduct = await product.save()
        res.json(updatedProduct)
    } else{
        res.status(404)
        throw new Error('Product not found')
    }
   
})

export { getProducts, getProductById, deleteProduct, addProduct, updateProduct }