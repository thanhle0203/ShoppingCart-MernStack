const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const winston = require('winston');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');

// Create a logger instance
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log' })
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  )
});

// Define API endpoints
router.post('/signup', async (req, res) => {
  // Request body contains username, email, password, and confirmPassword
  const { username, email, password, confirmPassword } = req.body;

  // Check if the password and confirm password match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Password and confirm password do not match' });
  }

  try {
    // Create a new user instance
    const user = new User({ username, email, password });

    // Save the user to the database
    await user.save();

    // Return a success response
    res.status(201).json({ message: 'User sign-up successful' });
  } catch (error) {
    // Log the error
    logger.error('An error occurred while signing up the user', error);

    // Return an error response
    res.status(500).json({ message: 'An error occurred while signing up the user' });
  }
});

module.exports = router;


router.post('/signin', async (req, res) => {
  // Request body contains username and password
  const { username, password } = req.body;

  try {
    // Find the user in the database by the provided username
    const user = await User.findOne({ username });

    if (user) {
      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        // User is authenticated
        const token = user.generateAuthToken(); // Generate a JWT
        
        // Return the token in the response
        res.status(200).json({ token });
      } else {
        // Invalid credentials
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      // User not found
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    // Handle any errors that occur during the database query
    res.status(500).json({ message: 'An error occurred while signing in' });
  }
});


// Protected route that requires authentication
router.get('/protected', authMiddleware, (req, res) => {
  // Access the authenticated user through req.user
  const user = req.user;
  res.json({ message: 'You accessed a protected route', user });
});




module.exports = router;
