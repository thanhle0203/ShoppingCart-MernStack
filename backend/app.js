const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const router = express.Router();
//const authMiddleware = require('./middleware/authMiddleware');

// Apply authMiddleware to all routes
//router.use(authMiddleware);


const app = express();

app.use(bodyParser.json());
app.use(cors());
// Apply the authentication middleware before the order routes
//app.use(authMiddleware);


const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');
const checkoutRoutes = require('./routes/checkout');

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/checkout', checkoutRoutes);

const mongoose = require('mongoose');
const connection = "mongodb+srv://shoppingcart:ShoppingCartApp@cluster0.c4qvmyz.mongodb.net/";
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