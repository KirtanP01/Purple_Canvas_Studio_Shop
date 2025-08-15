import mongoose from 'mongoose'
import dotenv from 'dotenv'
import colors from 'colors'
import Order from './models/orderModel.js'
import connectDB from './config/db.js'

dotenv.config()

connectDB()

const clearAllOrders = async () => {
    try {
        console.log('Clearing all orders from database...'.yellow.inverse)
        
        // Delete all orders from the database
        const result = await Order.deleteMany({})
        
        console.log(`Successfully deleted ${result.deletedCount} orders`.green.inverse)
        console.log('All orders have been removed while keeping order functionality intact'.green)
        console.log('Users can still place new orders through your existing order system'.green)
        
        process.exit()
    } catch (error) {
        console.error(`Error: ${error.message}`.red.inverse)
        process.exit(1)
    }
}

clearAllOrders()
