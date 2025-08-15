import mongoose from 'mongoose'
import dotenv from 'dotenv'
import colors from 'colors'
import Product from './models/productModel.js'
import connectDB from './config/db.js'

dotenv.config()

connectDB()

const clearAllReviews = async () => {
    try {
        console.log('Clearing all reviews from database...'.yellow.inverse)
        
        // Update all products to clear reviews array and reset rating/numReviews
        const result = await Product.updateMany(
            {}, // Empty filter to match all products
            {
                $set: {
                    reviews: [],
                    rating: 0,
                    numReviews: 0
                }
            }
        )
        
        console.log(`Successfully cleared reviews from ${result.modifiedCount} products`.green.inverse)
        console.log('All reviews have been removed while keeping review functionality intact'.green)
        
        process.exit()
    } catch (error) {
        console.error(`Error: ${error.message}`.red.inverse)
        process.exit(1)
    }
}

clearAllReviews()
