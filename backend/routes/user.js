const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const winston = require('winston');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const authMiddleware = require('../middleware/authMiddleware');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors');

router.use(cors({ origin: 'http://localhost:3000', credentials: true }));

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

// Configure Passport.js to use the Google Strategy
passport.use(
  'googleToken',
  new GoogleStrategy(
    {
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
      callbackURL: 'http://localhost:4000/api/users/oauth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user already exists in the database
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          // Create a new user if the user does not exist
          user = new User({
            username: profile.displayName,
            email: profile.emails[0].value,
            password: '' // You can generate a random password or leave it empty
          });

          // Save the new user to the database
          await user.save();
        }

        // User is authenticated
        const token = user.generateAuthToken(); // Generate a JWT
        done(null, token);
      } catch (error) {
        // Log the error
        logger.error('An error occurred while handling Google sign-in', error);
        done(error);
      }
    }
  )
);

const axios = require('axios');
const qs = require('qs');

router.get('/oauth/google/callback', async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ error: 'Missing authorization code' });
    }

    const params = {
      code,
      client_id: process.env.clientID,
      client_secret: process.env.clientSecret,
      redirect_uri: 'http://localhost:4000/api/users/oauth/google/callback',
      grant_type: 'authorization_code'
    };

    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', qs.stringify(params));

    // Extract the access token from the token response
    const { access_token } = tokenResponse.data;

    // Use the access token to make authenticated requests to Google APIs
    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    // You can access the user data in userResponse.data
    const user = userResponse.data;

    // Process the user data as needed
    console.log(user);

    res.send(user);
  } catch (error) {
    res.status(error.response.status).send(error.response.data);
  }
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
