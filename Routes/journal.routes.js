const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journal.controllers.js');
const auth = require("../middleware/auth");
const upload=require("../middleware/multer")


// Get all journal entries
router.get('/entries', auth, journalController.getAllEntries);

// Create a new journal entry 
router.post('/entries', auth, journalController.createEntry);

// Define the upload endpoint
router.post('/upload',upload.single('image'), journalController.uploadImage);


// Update a journal entry
router.put('/entries/:id', auth, journalController.updateEntry);



// Delete a journal entry
router.delete('/entries/:id', auth, journalController.deleteEntry);

module.exports = router;  

