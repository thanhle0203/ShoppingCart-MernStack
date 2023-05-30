import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button } from 'react-bootstrap';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/cart');
        setCartItems(response.data.cartItems);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, []);

  const handleRemoveFromCart = async (itemId) => {
    try {
      await axios.delete(`http://localhost:4000/api/cart/${itemId}`);
      setCartItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const handleQuantityChange = async (itemId, quantity) => {
    try {
      await axios.put(`http://localhost:4000/api/cart/${itemId}`, { quantity });
      // Fetch the updated cart items from the server
      const response = await axios.get('http://localhost:4000/api/cart');
      setCartItems(response.data.cartItems);
    } catch (error) {
      console.error('Error changing quantity:', error);
    }
  };

  const handleCheckout = async () => {
    try {
      // Prepare the cart items for checkout
      const items = cartItems.map((item) => ({
        _id: item._id,
        quantity: item.quantity,
      }));

      // Make a request to the server to process the checkout
      await axios.post('http://localhost:4000/api/checkout', { cartItems: items });

      // Clear the cart after successful checkout
      setCartItems([]);

      // Show a success message to the user
      alert('Checkout successful!');
    } catch (error) {
      console.error('Error during checkout:', error);
      // Show an error message to the user
      alert('Error during checkout. Please try again.');
    }
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.quantity * item.productPrice, 0);

  return (
    <div>
      <h2>Cart Items</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <Card key={item._id} className="mb-4" style={{ width: '500px' }}>
              <Card.Img
                variant="top"
                src={item.productImage}
                alt={item.productName}
                style={{ height: '100px', width: '100px', objectFit: 'cover' }}
              />
              <Card.Body>
                <Card.Title>{item.productName}</Card.Title>
                <Card.Text>Price: ${item.productPrice}</Card.Text>
                <div>
                  <label>Quantity: </label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                  />
                </div>
                <Button variant="danger" onClick={() => handleRemoveFromCart(item._id)} style={{ marginTop: '10px' }}>
                  Remove from Cart
                </Button>
              </Card.Body>
            </Card>
          ))}
          <h4>Total Price: ${totalPrice}</h4>
          <Button variant="success" onClick={handleCheckout}>
            Checkout 
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;
