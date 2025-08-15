import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import cors from 'cors'
import connectDB from './config/db.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import morgon from 'morgan'
//import products from './data/products.js'

import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'

dotenv.config()

connectDB()

const app = express()

// CORS Configuration
const corsOptions = {
    origin: [
        'http://localhost:3000', // React development server
        'http://localhost:3001', // Production build server
        'http://ec2-54-167-19-199.compute-1.amazonaws.com:5000', // AWS EC2 backend
        'http://ec2-54-167-19-199.compute-1.amazonaws.com', // AWS EC2 without port
        'https://ec2-54-167-19-199.compute-1.amazonaws.com', // HTTPS version
        'http://purplecanvasshop.s3-website-us-east-1.amazonaws.com', // S3 website
        'https://purplecanvasshop.s3-website-us-east-1.amazonaws.com', // S3 website HTTPS
    ],
    credentials: true,
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

if(process.env.NODE_ENV==='development'){
    app.use(morgon('dev'))
}

// Handle file uploads before express.json() to avoid conflicts
app.use('/api/upload', (req, res, next) => {
    console.log(`Upload route hit: ${req.method} ${req.url}`)
    next()
}, uploadRoutes)

app.use(express.json())

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)

app.get('/api/config/paypal', (req, res) => 
    res.send(process.env.NODE_ENV === 'production' ? process.env.PAYPAL_CLIENT_ID : process.env.PAYPAL_CLIENT_ID_SANDBOX)
)

const __dirname = path.resolve()
// Serve uploads directory from the project root
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

console.log(process.env.NODE_ENV)

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/build')))

    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html')))
} else {
    app.get('/', (req, res) => {
        res.send('API is running... online')
    })
}

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.magenta.bold))