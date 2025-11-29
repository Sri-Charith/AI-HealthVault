const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/authMiddleware'); // ✔️ This stays the same

// Get notifications
router.get('/', authMiddleware, async (req, res) => {
    try {
      const notifications = await Notification.find({ 
        userId: req.user.id, 
        read: false 
      }).sort({ createdAt: -1 });
  
      res.status(200).json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ msg: "Failed to fetch notifications" });
    }
  });
  
// Mark all as read and delete them
router.put('/mark-read', authMiddleware, async (req, res) => {
    try {
      // First, mark them as read (optional if you're going to delete right away)
      await Notification.updateMany(
        { userId: req.user.id, read: false },
        { $set: { read: true } }
      );
  
      // Then delete all read notifications
      await Notification.deleteMany({ userId: req.user.id, read: true });
  
      res.status(200).json({ msg: 'All notifications marked as read and deleted' });
    } catch (error) {
      console.error("Error in mark-read route:", error);
      res.status(500).json({ msg: 'Something went wrong' });
    }
  });
  

module.exports = router;
