import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Form } from 'react-bootstrap';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [paymentInfo, setPaymentInfo] = useState({
    paymentMethod: 'credit card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
  });

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage
      console.log('Cart token:', token); // Check if the token is retrieved correctly
      if (token) {
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        console.log('Headers:', headers);
        const response = await axios.get('http://localhost:4000/api/cart', {
          headers,
        });
        console.log('Response:', response.data); // Log the response for debugging
        setCartItems(response.data.cartItems);
      } else {
        console.error('Authentication token not available');
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage
      if (token) {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // Prepare the cart items for checkout
        const items = cartItems.map((item) => ({
          _id: item._id,
          quantity: item.quantity,
        }));

        // Make a request to the server to process the checkout
        const response = await axios.post(
          'http://localhost:4000/api/checkout',
          {
            cartItems: items,
            paymentInfo,
          },
          {
            headers,
          }
        );

        // Check the payment result from the response
        if (response.data.success) {
          // Clear the cart after successful checkout
          setCartItems([]);

          // Save the order to the local storage
          localStorage.setItem('order', JSON.stringify(response.data.order));
          console.log(response.data.order)

          // Show a success message to the user
          alert('Checkout successful!');
        } else {
          // Show an error message to the user
          alert('Payment failed. Please try again.');
        }
      } else {
        // Handle case when token is not available
        console.error('Authentication token not available');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      // Show an error message to the user
      alert('Error during checkout. Please try again.');
    }
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.quantity * item.productPrice,
    0
  );

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

  const handlePaymentInfoChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

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
                <Button
                  variant="danger"
                  onClick={() => handleRemoveFromCart(item._id)}
                  style={{ marginTop: '10px' }}
                >
                  Remove from Cart
                </Button>
              </Card.Body>
            </Card>
          ))}
          <h4>Total Price: ${totalPrice}</h4>

          <h2>Payment Information</h2>
          <Form>
            <Form.Group>
              <Form.Label>Payment Method</Form.Label>
              <Form.Control
                as="select"
                name="paymentMethod"
                value={paymentInfo.paymentMethod}
                onChange={handlePaymentInfoChange}
              >
                <option value="credit card">Credit Card</option>
                <option value="paypal">PayPal</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Card Number</Form.Label>
              <Form.Control
                type="text"
                name="cardNumber"
                value={paymentInfo.cardNumber}
                onChange={handlePaymentInfoChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Expiry Date</Form.Label>
              <Form.Control
                type="text"
                name="expiryDate"
                value={paymentInfo.expiryDate}
                onChange={handlePaymentInfoChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>CVV</Form.Label>
              <Form.Control
                type="text"
                name="cvv"
                value={paymentInfo.cvv}
                onChange={handlePaymentInfoChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Billing Address</Form.Label>
              <Form.Control
                type="text"
                name="billingAddress"
                value={paymentInfo.billingAddress}
                onChange={handlePaymentInfoChange}
              />
            </Form.Group>
          </Form>

          <Button variant="success" onClick={handleCheckout}>
            Checkout
          </Button>
        </div>
      )}
    </div>
  );
};


export default Cart;
