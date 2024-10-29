const cloudinary = require('cloudinary').v2; // Use v2 for Cloudinary
const fs = require('fs');
const path = require('path');

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    
    try {
        if (!localFilePath) return null;

        // Check if the file exists before attempting to upload
        if (!fs.existsSync(localFilePath)) {
            console.error(`File not found: ${localFilePath}`);
            return null;
        }

        // Upload the file on Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        // File has been uploaded successfully
        console.log(`File is uploaded on Cloudinary: ${response.secure_url}`);
        
        // Remove the locally saved temporary file after upload
        fs.unlinkSync(localFilePath);
        
        return response;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        
        // Ensure the file exists before trying to unlink
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath); // Remove the locally saved temporary file as the upload operation failed
        }

        return null;
    }
}

module.exports = uploadOnCloudinary;
