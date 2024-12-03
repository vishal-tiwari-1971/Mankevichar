require('dotenv').config();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads', // Cloudinary folder
        allowed_formats: ['jpg', 'jpeg', 'png'], // Allowed formats
        public_id: (req, file) => `journal-${Date.now()}-${file.originalname.split('.')[0]}`, // Unique naming
    },
});

const upload = multer({ storage: storage });

module.exports = upload;
