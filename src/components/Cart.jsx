import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_8B9VvZ6OI2wjUnICvr2qArjv');

const usePaymentFlow = () => {
  const stripe = useStripe();
  const elements = useElements();

  const createPaymentMethod = async () => {
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (error) {
      console.error('Error creating payment method:', error);
      throw new Error('Payment method creation failed');
    }

    return paymentMethod;
  };

  const confirmPayment = async (sessionId, paymentMethod) => {
    const { error } = await stripe.confirmCardPayment(sessionId, {
      payment_method: paymentMethod.id,
    });

    if (error) {
      console.error('Error confirming card payment:', error);
      throw new Error('Payment confirmation failed');
    }
  };

  return { createPaymentMethod, confirmPayment };
};

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const { createPaymentMethod, confirmPayment } = usePaymentFlow();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.get('http://localhost:4000/api/cart', {
          headers,
        });
        setCartItems(response.data.cartItems);
      } else {
        console.error('Authentication token not available');
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const handleRemoveFromCart = async (itemId) => {
    try {
      await axios.delete(`http://localhost:4000/api/cart/${itemId}`);
      setCartItems((prevItems) =>
        prevItems.filter((item) => item._id !== itemId)
      );
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const handleQuantityChange = async (itemId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        await axios.put(
          `http://localhost:4000/api/cart/${itemId}`,
          { quantity },
          { headers }
        );
        const response = await axios.get('http://localhost:4000/api/cart', {
          headers,
        });
        setCartItems(response.data.cartItems);
      } else {
        console.error('Authentication token not available');
      }
    } catch (error) {
      console.error('Error changing quantity:', error);
    }
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.quantity * item.productPrice,
    0
  );

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Authentication token not available');
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Retrieve the Stripe client secret from the server
      const { data } = await axios.post(
        'http://localhost:4000/api/checkout/create-checkout-session',
        {
          items: cartItems.map((item) => ({
            name: item.productName,
            price: parseFloat(item.productPrice),
            quantity: item.quantity,
          })),
          customerName,
          customerEmail,
        },
        { headers }
      );
      const { sessionId } = data;

      // Create a new payment method
      const paymentMethod = await createPaymentMethod();

      // Confirm the payment
      await confirmPayment(sessionId, paymentMethod);

      // Redirect to success page or handle successful payment
      navigate('/success');
    } catch (error) {
      console.error('Error during checkout:', error);
      // Handle any unexpected errors (display an error message, etc.)
    }
  };

  return (
    <div>
      <h1>Cart</h1>
      <div>
        {cartItems.map((item) => (
          <Card key={item._id}>
            <Card.Body>
              <Card.Title>{item.productName}</Card.Title>
              <Card.Text>Price: ${item.productPrice}</Card.Text>
              <Card.Text>Quantity: {item.quantity}</Card.Text>
              <Button
                variant="danger"
                onClick={() => handleRemoveFromCart(item._id)}
              >
                Remove from Cart
              </Button>
              <Form.Group controlId={`formQuantity_${item._id}`}>
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(item._id, parseInt(e.target.value))
                  }
                />
              </Form.Group>
            </Card.Body>
          </Card>
        ))}
      </div>
      <h3>Total: ${totalPrice.toFixed(2)}</h3>
      {cartItems.length > 0 && (
        <>
          <Form.Group controlId="formCustomerName">
            <Form.Label>Customer Name</Form.Label>
            <Form.Control
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formCustomerEmail">
            <Form.Label>Customer Email</Form.Label>
            <Form.Control
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
          </Form.Group>
          <Elements stripe={stripePromise}>
            <CardElement />
          </Elements>
          <Button onClick={handleCheckout}>Checkout</Button>
        </>
      )}
    </div>
  );
};

export default Cart;
