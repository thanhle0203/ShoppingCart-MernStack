
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// get config vars
dotenv.config();

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  confirmPassword: { type: String, required: false },
  register_date: {
    type: Date,
        default: Date.now
  }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

// access config var
const secret = process.env.JWT_SECRET || 'your_default_secret_here';

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, secret);
  return token;
};


const User = mongoose.model('User', userSchema);

module.exports = User;
