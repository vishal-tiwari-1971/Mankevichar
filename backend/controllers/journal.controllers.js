const Journal = require('../model/journal'); 
const User = require('../model/user')
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2; 
const auth= require('../middleware/auth')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // or other configuration
const path = require('path');  


// Get all journal entries
exports.getAllEntries = async (req, res) => {
    try {
        const journals = await Journal.find(); 
        return res.status(200).json(journals);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Error retrieving journal entries.");
    }
}; 

// Get journal entries by Id
exports.getEntriesById = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(400).json({ error: 'User not found in token' });
          }
            // Fetch the journals related to the userId
    const journals = await Journal.find({ userId });
       return res.status(200).json(journals);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Error retrieving journal entries.");
    }
};

// Get journal by User Id
exports.getUSerJournal =[ auth , async (req, res) => {
    try {  const userId= req.user.id
        console.log("Received userId:", userId);

        if (!( mongoose.Types.ObjectId.isValid(userId))) {
            return res.status(400).json({ error: 'Invalid userId format' });
        }

        // Query the database for journals
        const journals = await Journal.find({ userId });
        // console.log("Found journals:", journals);  // Log the found journals
        return res.status(200).json(journals);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Error retrieving journal entries.");
    }
} ];

// Create a new journal entry with an image upload
exports.createEntry = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!(title && content)) {
            return res.status(400).send("Title and content are required.");
        }


        
    let image = req.file ? req.file.path : null;


        const journal = await Journal.create({
            title,
            content,
            image,  // Save the image path to the journal entry
            userId: req.user.id
        });

        return res.status(201).json(journal);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Error creating journal entry.");
    }
};


// Update a journal entry
exports.updateEntry = async (req, res) => {
    try {
        const { title, content } = req.body;
        const { id } = req.params;
        console.log('Received ID:', id);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send('Invalid ID format');
        }
        

        const journal = await Journal.findById(id);
        console.log('Received ID:', id);

        if (!journal) {
            return res.status(404).send("Journal entry not found.");
        }

        // Check if the logged-in user owns the product entry
        if (journal.userId.toString() !== req.user.id) {
            return res.status(403).send("You are not authorized to update this entry.");
        }
        // Update title and content if provided
        journal.title = title || journal.title;
        journal.content = content || journal.content;
        // journal.image = image || journal.image;
       
        if (req.file) {
            console.log('File received:', req.file);
            // Delete the old image if it exists (consider storing URLs rather than local paths)
            if (journal.image) {
             
                const publicId = path.basename(journal.image, path.extname(journal.image)); // Extract public ID from URL
                await cloudinary.uploader.destroy(publicId); // Remove the old image from Cloudinary
            }
            // Upload new image to Cloudinary
            const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
                folder: 'uploads', // Specify the folder in Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg'], // Specify allowed formats
        filename: (req, file) => {
            return Date.now() + '-' + file.originalname; // Unique filename
        }
            }); 
            if (uploadResponse) {
                journal.image = uploadResponse.secure_url; // Set the new image URL
            }
        }

        await journal.save();

        return res.status(200).json(journal);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Error updating journal entry.");
    }
};

// Delete a journal entry
exports.deleteEntry = async (req, res) => {
    try {
        const { id } = req.params; 
        console.log('Received ID:', id);
         // Check if the provided ID is a valid ObjectId
         if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send('Invalid ID format');
        }
        // Use findByIdAndDelete to remove the journal entry
        const journal = await Journal.findById(id);

        // image URL to debug
        console.log('Image URL:', journal.image);

        if (!journal) {
            return res.status(404).send("Journal entry not found");
        }

         // Check if the logged-in user owns the product entry
         if (journal.userId.toString() !== req.user.id) {
            return res.status(403).send("You are not authorized to delete this entry.");
        }

          // If there is an associated image, delete it from Cloudinary
         if (journal.image) {
            const publicId = path.basename(journal.image, path.extname(journal.image));  // Extract the public ID from the URL

            console.log('Extracted Public ID:', publicId);  // Log the extracted public ID for debugging

            // Delete the image from Cloudinary using the public ID
            const cloudinaryResponse = await cloudinary.uploader.destroy(publicId);

            console.log('Cloudinary Response:', cloudinaryResponse);  // Log the Cloudinary response for debugging

            // Check if Cloudinary responded with a valid result
        //     if (cloudinaryResponse.result !== 'ok') {
        //         console.log('Failed to delete image from Cloudinary');
        //         return res.status(500).send('Error deleting image from Cloudinary');
        //     }
        }

         // Delete the journal entry from the database
         await Journal.findByIdAndDelete(id);

        return res.status(200).send("Journal entry deleted successfully");
    } catch (error) {
        console.log(error);
        return res.status(500).send("There was an error deleting the journal entry.");
    }
};

 