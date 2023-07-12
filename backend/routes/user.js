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

router.use(cors());

// Enable CORS for all routes
// router.use(
//   cors({
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST'],
//     allowedHeaders: ['Content-Type', 'Authorization', 'Origin'],
//     credentials: true
//   })
// );

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
passport.use('googleToken',
  new GoogleStrategy(
    {
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
      callbackURL: '/api/users/oauth/google/callback',
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
      passReqToCallback: true 

    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user already exists in the database
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          // Create a new user if the user does not exist
          user = new User({
            username: profile.displayName,
            email: profile.emails[0].value,
            password: '', // You can generate a random password or leave it empty
          });

          // Save the new user to the database
          await user.save();
        }

        // User is authenticated
        const token = user.generateAuthToken(); // Generate a JWT

        // Establish a session
        req.logIn(user, (err) => {
          if (err) {
            logger.error('Error while establishing session', err);
            return done(err);
          }
          done(null, token);
        });

      } catch (error) {
        // Log the error
        logger.error('An error occurred while handling Google sign-in', error);
        done(error);
      }
    }
  )
);



// Add the following route handler after the GoogleStrategy configuration
router.get('/oauth/google/callback', passport.authenticate('googleToken', { session: false }), (req, res) => {
  const token = req.user;
  res.redirect(`http://localhost:3000/oauth/google/callback?token=${token}`);
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

// Handle Google sign-in
router.post('/oauth/google', passport.authenticate('googleToken', { session: false}),
  (req, res, next) => {
    const token = jwt.sign({ id: req.user.id }, process.env.clientSecret);
    // res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    // res.header('Access-Control-Allow-Credentials', 'true');
    // res.header('Access-Control-Allow-Methods', 'POST');
    res.json({ token });
  }
);




module.exports = router;
