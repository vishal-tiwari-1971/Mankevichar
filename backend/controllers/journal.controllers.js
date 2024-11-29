const Journal = require('../model/journal'); 
const User = require('../model/user')
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2; 
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // or other configuration
const path = require('path');  
const auth= require('../middleware/auth')
 
// Get all journal entries
exports.getAllEntries = async (req, res) => {
    try {
        const journals = await Journal.find({visibility:"public"}); 
        return res.status(200).json(journals);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Error retrieving journal entries.");
    }
}; 


// Get journal entries by id
exports.getEntryById = async (req, res) => {
    try {
        const journals = await Journal.findById(req.params.id); 

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
        const { title, content,visibility } = req.body;

        if (!(title && content)) {
            return res.status(400).send("Title and content are required.");
        }
        
    let image = req.file ? req.file.path : null;


        const journal = await Journal.create({
            title,
            content,
            image,
            visibility,  // Save the image path to the journal entry
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
        const {visibility } = req.body;
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
        journal.visibility = visibility || journal.visibility;  // Save the visibility to the journal entry
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

        // Validate Mongoose ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid journal ID format.' });
        }

        // Find the journal entry
        const journal = await Journal.findById(id);
        if (!journal) {
            return res.status(404).json({ message: 'Journal entry not found.' });
        }

        // Delete the image from Cloudinary if exists
        if (journal.image && journal.image.startsWith('https://res.cloudinary.com/')) {
            const urlParts = journal.image.split('/uploads/');
            if (urlParts.length > 1) {
                const publicId = `uploads/${urlParts[1].split('.')[0]}`; // Extract the public ID with folder

                try {
                    const cloudinaryResponse = await cloudinary.uploader.destroy(publicId);
                    console.log('Image deleted from Cloudinary:', cloudinaryResponse);
                    
                    if (cloudinaryResponse.result !== 'ok' && cloudinaryResponse.result !== 'not found') {
                        console.error('Cloudinary deletion error:', cloudinaryResponse);
                        return res.status(500).json({ message: 'Error deleting image from Cloudinary.' });
                    }
                } catch (cloudError) {
                    console.error('Cloudinary API error:', cloudError);
                    return res.status(500).json({ message: 'Cloudinary image deletion failed.' });
                }
            } else {
                console.warn('Image URL does not match expected format:', journal.image);
            }
        } else {
            console.info('No valid Cloudinary image to delete.');
        }

        // Delete the journal entry
        await Journal.findByIdAndDelete(id);
         console.log("Deleted journal entry with ID:", id);
         
        return res.status(200).json({ message: 'Journal entry deleted successfully.' });
    } catch (error) {
        console.error('Delete entry error:', error);
        return res.status(500).json({ message: 'Error deleting the journal entry.' });
    }
};
 