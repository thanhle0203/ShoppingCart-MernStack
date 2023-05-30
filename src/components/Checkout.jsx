import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get('/api/cart');
        setCartItems(response.data.cartItems);
        setTotalPrice(response.data.totalPrice);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, []);

  const handleCheckout = async () => {
    try {
      const response = await axios.post('/api/checkout');
      console.log('Checkout successful:', response.data);
      // Perform any additional actions after successful checkout
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  return (
    <div>
      <h2>Checkout</h2>
      <h3>Cart Items:</h3>
      <ul>
        {cartItems.map((item) => (
          <li key={item._id}>
            <h4>Product: {item.productName}</h4>
            <p>Price: ${item.price}</p>
          </li>
        ))}
      </ul>
      <p>Total Price: ${totalPrice}</p>
      <button onClick={handleCheckout}>Checkout</button>
    </div>
  );
};

export default Checkout;
