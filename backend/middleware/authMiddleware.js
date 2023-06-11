const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/user');

// get config vars
dotenv.config();

// access config var
const secret = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
  // Get the token from the request header
  const authHeader = req.headers.authorization;

  console.log('Authorization header:', authHeader); // Add this line

  // Check if Authorization header exists
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization denied' });
  }

  // Extract the token from the Authorization header
  const token = authHeader.split(' ')[1];

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
