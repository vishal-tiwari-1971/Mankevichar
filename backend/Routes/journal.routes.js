const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journal.controllers.js');
const auth = require("../middleware/auth");
const Journal = require('../model/journal');

const upload = require('../middleware/multer'); // Adjust the path as needed

// Get all journal entries
router.get('/entries',  journalController.getAllEntries);

// Create a new journal entry (with image upload) initially entries
router.post('/entries', auth, upload.single('image'), journalController.createEntry);

// Get Journal by User Id
router.get('/dashboard',auth ,journalController.getUSerJournal)

// Get a specific journal entry
router.get('/entry/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const journal = await Journal.findById(id); // Replace with your DB query
      if (!journal) {
        return res.status(404).json({ message: 'Journal not found' });
      }
      res.json(journal);
    } catch (error) {
      console.error('Error fetching journal:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Toggle like and update count
router.put('/like/:id', async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);
    if (!journal) return res.status(404).send('Journal not found');

    const { liked } = req.body;
    journal.likes = liked ? journal.likes + 1 : Math.max(journal.likes - 1, 0);
    await journal.save();

    res.status(200).json({ likes: journal.likes });
  } catch (err) {
    res.status(500).json({ message: 'Error updating likes', error: err.message });
  }
});

// Update a journal entry
router.put('/entries/:id', auth, upload.single('image'), journalController.updateEntry);

// Delete a journal entry
router.delete('/entries/:id', auth, journalController.deleteEntry);

module.exports = router;  

