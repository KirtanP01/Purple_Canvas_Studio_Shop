import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

// description: Fetch all products
// route: GET /api/products
// access: Public
const getProducts = asyncHandler(async(req, res) => {
    const pageSize = 4  
    const pageNum = req.query.pageNumber? Number(req.query.pageNumber) : 1

    const keyword = req.query.keyword
    ?{
        name: {
            $regex: req.query.keyword,
            $options: 'i',
        },
     }
    : {}

    const productCount = await Product.countDocuments({...keyword})
    //const products = await Product.find()
    const products = await Product.find({...keyword}).limit(pageSize).skip(pageSize * (pageNum -1))

    //res.json(products)
    res.json({products, pageNum, pages: Math.ceil(productCount / pageSize)})

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

// description: Create new product review
// route: POST /api/products/:id/review
// access: Private
const createProductReview = asyncHandler(async(req, res) => {
    
    const {rating, comment } = req.body
    const product = await Product.findById(req.params.id)


    if(product){
    
        const alreadyReviewed = product.reviews.find(r => (r.user).toString() === req.user._id.toString())
        if (alreadyReviewed){
            res.status(400)
            throw new Error('Product already reviewed')
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment: comment,
            user: req.user._id,
            createdAt: Date.now()
        }
        product.reviews.push(review)
        product.numReviews = product.reviews.length
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length
        await product.save()
        res.status(201).json('Review successfully added')

    } else{
        res.status(404)
        throw new Error('Product not found')
    }
   
})

// description: Get top rated products
// route: GET /api/products/top
// access: Public
const getTopProducts = asyncHandler(async(req, res) => {
    const porducts = await Product.find({}).sort({rating: -1}).limit(3) //sorting in ascending order
    res.json(porducts) 
})

export { getProducts, getProductById, deleteProduct, addProduct, updateProduct, createProductReview, getTopProducts }