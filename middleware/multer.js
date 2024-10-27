const multer = require('multer');
const path = require('path');

// Set up Multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, './public/temp')); // Uploads folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Ensure unique filename
    }
});

// Multer middleware to handle image uploads
const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);

        if (mimeType && extName) {
            return cb(null, true);
        } else {
            cb(new Error('Only .jpg, .jpeg, .png files are allowed!'));
        }
    }
});


export {upload}