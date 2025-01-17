const Journal = require('../model/journal');
const User = require('../model/user')
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // or other configuration
const path = require('path');
const auth = require('../middleware/auth')

// Get all journal entries
exports.getAllEntries = async (req, res) => {
    try {
        const journals = await Journal.find({ visibility: "public" });
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
exports.getUSerJournal = [auth, async (req, res) => {
    try {
        const userId = req.user.id
        console.log("Received userId:", userId);

        if (!(mongoose.Types.ObjectId.isValid(userId))) {
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
}];

// Create a new journal entry with an image upload
exports.createEntry = async (req, res) => {
    try {
        const { title, content, visibility } = req.body;

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
        const { title, content, visibility } = req.body;
        const { id } = req.params;

        // Validate journal ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid journal ID format.' });
        }

        const journal = await Journal.findById(id);
        if (!journal) {
            return res.status(404).json({ message: 'Journal entry not found.' });
        }

        // Authorization check
        if (journal.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to update this entry.' });
        }

        // Update fields
        journal.title = title || journal.title;
        journal.content = content || journal.content;
        journal.visibility = visibility || journal.visibility;

        // Handle image upload
        if (req.file) {
            // Delete old image if exists
            if (journal.image && journal.image.startsWith('https://res.cloudinary.com/')) {
                const urlParts = journal.image.split('/uploads/');
                if (urlParts.length > 1) {
                    const publicId = `uploads/${urlParts[1].split('.')[0]}`;
                    await cloudinary.uploader.destroy(publicId);
                }
            }

            // Upload new image
            journal.image = req.file.path;
        }

        await journal.save();
        return res.status(200).json(journal);
    } catch (error) {
        console.error('Error updating entry:', error);
        return res.status(500).json({ message: 'Error updating journal entry.' });
    }
};

// Delete a journal entry
exports.deleteEntry = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate journal ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid journal ID format.' });
        }

        const journal = await Journal.findById(id);
        if (!journal) {
            return res.status(404).json({ message: 'Journal entry not found.' });
        }

        // Delete image from Cloudinary
        if (journal.image && journal.image.startsWith('https://res.cloudinary.com/')) {
            const urlParts = journal.image.split('/uploads/');
            if (urlParts.length > 1) {
                const publicId = `uploads/${urlParts[1].split('.')[0]}`;
                const response = await cloudinary.uploader.destroy(publicId);

                if (response.result !== 'ok' && response.result !== 'not found') {
                    return res.status(500).json({ message: 'Error deleting image from Cloudinary.' });
                }
            }
        }

        // Delete journal entry
        await Journal.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Journal entry deleted successfully.' });
    } catch (error) {
        console.error('Error deleting journal entry:', error);
        return res.status(500).json({ message: 'Error deleting the journal entry.' });
    }
};