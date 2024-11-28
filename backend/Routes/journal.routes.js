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
router.post('/:id/like', auth, async (req, res) => {
  try {
    const journalId = req.params.id;
    const userId = req.user.id; // Assume user ID from JWT

    const journal = await Journal.findById(journalId);
    if (!journal) {
      return res.status(404).json({ message: 'Journal not found' });
    }

    // Ensure `likes` is an array
    if (!Array.isArray(journal.likes)) {
      journal.likes = []; // Initialize as empty array if undefined
    }

    const hasLiked = journal.likes.some((id) => id.toString() === userId.toString());

    if (hasLiked) {
      // Unlike the journal
      journal.likes.pull(userId);
      journal.likeCount--;
    } else {
      // Like the journal
      journal.likes.push(userId);
      journal.likeCount++;
    }

    await journal.save();

    res.status(200).json({ likeCount: journal.likeCount, hasLiked: !hasLiked });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a journal entry
router.put('/update/:id', auth, upload.single('image'), journalController.updateEntry);

// Delete a journal entry
router.delete('/entries/:id', auth, journalController.deleteEntry);

module.exports = router;  

