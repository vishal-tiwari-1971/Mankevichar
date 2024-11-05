const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journal.controllers');
const auth = require("../middleware/auth");

const upload = require('../middleware/multer'); // Adjust the path as needed



// Get all journal entries
router.get('/entries', auth, journalController.getAllEntries);

// Create a new journal entry (with image upload) initially entries
router.post('/entries', auth, upload.single('image'), journalController.createEntry);

// Update a journal entry (with image upload)
router.put('/entries/:id', auth, upload.single('image'), journalController.updateEntry);

// Delete a journal entry
router.delete('/entries/:id', auth, journalController.deleteEntry);

module.exports = router;