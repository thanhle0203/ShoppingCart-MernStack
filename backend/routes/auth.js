const express = require('express');
const router = express.Router();

// Protected route that requires authentication
router.get('/protected', authMiddleware, (req, res) => {
    // Access the authenticated user through req.user
    const user = req.user;
    res.json({ message: 'You accessed a protected route', user });
  });
  

  module.exports = router;