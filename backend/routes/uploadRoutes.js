import path from 'path'
import express from 'express'
import multer from 'multer'
import fs from 'fs'
const router = express.Router()

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
    console.log('Created uploads directory at:', uploadsDir)
} else {
    console.log('Uploads directory exists at:', uploadsDir)
}

const storage = multer.diskStorage({
    destination(req, file, cb) {
        const uploadPath = path.join(process.cwd(), 'uploads')
        console.log('Upload destination:', uploadPath)
        console.log('Current working directory:', process.cwd())
        console.log('Directory exists:', fs.existsSync(uploadPath))
        cb(null, uploadPath)
    },
    filename(req, file, cb) {
        const filename = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        console.log('Generated filename:', filename)
        cb(null, filename)
    }
})

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)

    if(extname && mimetype) {
        return cb(null, true)
    } else {
        cb('Images only!')
    }
}

const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB limit
    },
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb)
    }
})

// Test route to ensure the endpoint is working
router.get('/', (req, res) => {
    res.json({ message: 'Upload endpoint is working' })
})

router.post('/', (req, res) => {
    console.log('POST /api/upload hit')
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error('Multer error:', err)
            return res.status(400).json({ message: err.message || 'Upload failed' })
        }
        
        if (!req.file) {
            console.error('No file received')
            return res.status(400).json({ message: 'No file uploaded' })
        }
        
        // Return the full EC2 URL so S3 website can access the image
        const filePath = `http://ec2-54-167-19-199.compute-1.amazonaws.com:5000/uploads/${req.file.filename}`
        console.log('File uploaded successfully:', filePath)
        console.log('File details:', {
            originalName: req.file.originalname,
            filename: req.file.filename,
            size: req.file.size,
            path: req.file.path,
            fullUrl: filePath
        })
        res.send(filePath) // Send complete URL for S3 website
    })
})

export default router