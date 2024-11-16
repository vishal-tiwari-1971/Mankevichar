const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journal.controllers.js');
const auth = require("../middleware/auth");

const upload = require('../middleware/multer'); // Adjust the path as needed



// Get all journal entries
router.get('/entries',  journalController.getAllEntries);

// Create a new journal entry (with image upload) initially entries
router.post('/entries', auth, upload.single('image'), journalController.createEntry);

// Get journal by Id 
router.get('/entry/:id', journalController.getEntriesById)
// Update a journal entry
router.put('/entries/:id', auth, upload.single('image'), journalController.updateEntry);

// Delete a journal entry
router.delete('/entries/:id', auth, journalController.deleteEntry);

module.exports = router;  

