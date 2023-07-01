const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const router = express.Router();
const authMiddleware = require('./middleware/authMiddleware');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');

// Apply the authentication middleware before the routes that require authentication
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', authMiddleware, cartRoutes); // Apply authMiddleware to cart routes
app.use('/api/orders', authMiddleware, orderRoutes); // Apply authMiddleware to order routes

const mongoose = require('mongoose');
const connection = 'mongodb+srv://shoppingcart:ShoppingCartApp@cluster0.c4qvmyz.mongodb.net/';
mongoose.connect(connection, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
