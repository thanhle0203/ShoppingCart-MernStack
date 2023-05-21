const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

const mongoose = require('mongoose');
const connection = "mongodb+srv://shoppingcart:ShoppingCartApp@cluster0.c4qvmyz.mongodb.net/";
mongoose.connect(connection, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


