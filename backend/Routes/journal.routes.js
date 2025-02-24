const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journal.controllers.js');
const auth = require("../middleware/auth");
const Journal = require('../model/journal');
const User = require('../model/user');
const upload = require('../middleware/multer'); // Adjust the path as needed

// Get all journal entries
router.get('/entries',  journalController.getAllEntries);
   
// get by journal id
router.get('/entry/:id', journalController.getEntryById)

// Create a new journal entry (with image upload) initially entries
router.post('/entries', auth, upload.single('image'), journalController.createEntry);

// Get Journal by User Id
router.get('/dashboard',auth ,journalController.getUSerJournal)


// Toggle like for a journal
router.post('/:id/like', auth, journalController.likeJournal);

// Update a journal entry
router.put('/update/:id', auth, upload.single('image'), journalController.updateEntry);

// Delete a journal entry
router.delete('/delete/:id', auth, journalController.deleteEntry);

module.exports = router;  
