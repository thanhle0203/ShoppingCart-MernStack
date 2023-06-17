import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Form } from 'react-bootstrap';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const stripePromise = loadStripe('pk_test_8B9VvZ6OI2wjUnICvr2qArjv'); // Replace with your actual Stripe Publishable Key
  const [cartItems, setCartItems] = useState([]);
  const [paymentSuccess, setPaymentSuccess] = useState(false); // Define setPaymentSuccess before the return statement
  const [paymentInfo, setPaymentInfo] = useState({
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    billingAddress: '',
  });

  const navigate = useNavigate(); // Initialize useHistory


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
        const response = await axios.get('http://localhost:4000/api/cart', { headers });
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
      setCartItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
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
        const response = await axios.get('http://localhost:4000/api/cart', { headers });
        setCartItems(response.data.cartItems);
      } else {
        console.error('Authentication token not available');
      }
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

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.quantity * item.productPrice,
    0
  );

  const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const handleCheckout = async (event) => {
      event.preventDefault();
    
      try {
        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: elements.getElement(CardElement),
          billing_details: {
            address: {
              line1: paymentInfo.billingAddress,
            },
          },
        });
    
        if (error) {
          console.error('Error creating payment method:', error);
          return;
        }
    
        const { id: paymentMethodId } = paymentMethod;
    
        const checkoutData = {
          cartItems: cartItems.map((item) => ({
            productId: item.product._id, // Update this line to use the correct property name for the product ID
            quantity: item.quantity,
          })),
          paymentInfo: {
            ...paymentInfo,
            amount: totalPrice * 100, // Convert the totalPrice to the lowest currency unit (e.g., cents)
            currency: 'USD', // Set the currency value (e.g., USD)
            paymentMethodId,
          },
        };
    
        try {
          const response = await axios.post(
            'http://localhost:4000/api/checkout',
            checkoutData,
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
          );
    
          console.log('Payment response:', response.data); // Log the response data
    
          if (response.data && response.data.success) {
            console.log('Payment successful!');
            // Handle the successful payment (display a success message, redirect, etc.)
            setPaymentSuccess(true);
            navigate('/'); // Redirect to the home page
          } else if (response.data && response.data.error) {
            console.error('Error processing payment:', response.data.error);
            // Handle the payment error (display an error message, etc.)
          } else {
            console.error('Unexpected response:', response);
          }
        } catch (error) {
          console.error('Error during payment:', error);
          console.log('Payment response:', error.response?.data);
          // Handle the error during payment (display an error message, etc.)
        }
      } catch (error) {
        console.error('Error during checkout:', error);
        // Handle any unexpected errors (display an error message, etc.)
      }
    };

    return (
      <form onSubmit={handleCheckout}>
        {/* Payment form fields */}
        <CardElement />
        <Form.Group controlId="formCardNumber">
          <Form.Label>Card Number</Form.Label>
          <Form.Control
            type="text"
            name="cardNumber"
            value={paymentInfo.cardNumber}
            onChange={handlePaymentInfoChange}
          />
        </Form.Group>
        {/* Rest of the payment form fields */}
        <Button type="submit">Checkout</Button>
      </form>
    );
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
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
};

export default Cart;
