const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const router = express.Router();
const authMiddleware = require('./middleware/authMiddleware');

const app = express();

app.use(bodyParser.json());
// app.use(cors());
// app.use(
//   cors({
//     origin: '*', // Allow requests from this origin
//     methods: ['GET', 'POST', '*'], // Allow specified HTTP methods
//     allowedHeaders: ['Content-Type', 'Authorization'], // Allow specified headers
//     credentials: true // Allow sending cookies across origins
//   })
// );

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://localhost:3000"); // Update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  next();
});

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://localhost:3000");
  next();
});

const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');
const reviewsRoutes = require('./routes/reviews')

// Apply the authentication middleware before the routes that require authentication
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', authMiddleware, cartRoutes); // Apply authMiddleware to cart routes
app.use('/api/orders', authMiddleware, orderRoutes); // Apply authMiddleware to order routes
app.use('/api/reviews', reviewsRoutes);

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
