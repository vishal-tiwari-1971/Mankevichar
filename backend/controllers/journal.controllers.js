const Journal = require('../model/journal'); 
const mongoose = require('mongoose');

// Get all journal entries
exports.getAllEntries = async (req, res) => {
    try {
        const journals = await Journal.find({ userId: req.user.id }); 
        return res.status(200).json(journals);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Error retrieving journal entries.");
    }
};

// Create a new journal entry with an image upload
exports.createEntry = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!(title && content)) {
            return res.status(400).send("Title and content are required.");
        }

    //    let image = null;
       
    //     if (req.file) {
    //         // image = req.file.filename ;  Save the file name of the uploaded image
    //          // The file is uploaded to Cloudinary automatically
    // const image = req.file.path; // Get the URL of the uploaded file
    // // res.json({ message: 'File uploaded successfully', url: imagePath});
    //     }
        
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
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send('Invalid ID format');
        }
        

        const journal = await Journal.findById(id);
        console.log('Received ID:', id);

        if (!journal) {
            return res.status(404).send("Journal entry not found.");
        }

        // Check if the logged-in user owns the journal entry
        if (journal.userId.toString() !== req.user.id) {
            return res.status(403).send("You are not authorized to update this entry.");
        }

        // Update title and content if provided
        journal.title = title || journal.title;
        journal.content = content || journal.content;

        if (req.file) {
            // Delete the old image if it exists (consider storing URLs rather than local paths)
            if (journal.image) {
             
                const publicId = path.basename(journal.image, path.extname(journal.image)); // Extract public ID from URL
                await cloudinary.uploader.destroy(publicId); // Remove the old image from Cloudinary
            }
            // Upload new image to Cloudinary
            const uploadResponse = await uploadOnCloudinary(req.file.path); 
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

        const journal = await Journal.findById(id);

        if (!journal) {
            return res.status(404).send("Journal entry not found.");
        }

        // Check if the logged-in user owns the journal entry
        if (journal.userId.toString() !== req.user.id) {
            return res.status(403).send("You are not authorized to delete this entry.");
        }

        // Delete the image from Cloudinary if it exists
        if (journal.image) {
            const publicId = path.basename(journal.image, path.extname(journal.image)); // Extract public ID from URL
            await cloudinary.uploader.destroy(publicId); // Remove the image from Cloudinary
        }

        await journal.remove();

        return res.status(200).send("Journal entry deleted.");
    } catch (error) {
        console.log(error);
        return res.status(500).send("Error deleting journal entry.");
    }
};


