import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Elements, CardElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_8B9VvZ6OI2wjUnICvr2qArjv');

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const navigate = useNavigate();

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
  
        if (Array.isArray(response.data.cartItems)) {
          // Create a map to track existing items
          const existingItemsMap = new Map();
  
          // Update existing items with the latest price and quantity
          response.data.cartItems.forEach((item) => {
            const productId = item.products[0].product;
  
            if (existingItemsMap.has(productId)) {
              const existingItem = existingItemsMap.get(productId);
  
              // Update the quantity and price
              existingItem.products[0].quantity += item.products[0].quantity;
              existingItem.products[0].productPrice = item.products[0].productPrice;
            } else {
              // Add the item to the map
              existingItemsMap.set(productId, item);
            }
          });
  
          // Extract the updated items from the map
          const updatedItems = Array.from(existingItemsMap.values());
  
          setCartItems(updatedItems);
        } else {
          console.error('Invalid response data:', response.data);
          // Handle the error or set cartItems to an empty array
          setCartItems([]);
        }
      } else {
        console.error('Authentication token not available');
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };
  
  

  const handleRemoveFromCart = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        await axios.delete(`http://localhost:4000/api/cart/${itemId}`, { headers });
        setCartItems((prevItems) =>
          prevItems.filter((item) => item._id !== itemId)
        );
      } else {
      console.error('Authentication token not available');
    }
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
        fetchCartItems(); // Fetch updated cart items after quantity change
      } else {
        console.error('Authentication token not available');
      }
    } catch (error) {
      console.error('Error changing quantity:', error);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const headers = {
          Authorization: `Bearer ${token}`,
        };
  
        const existingItem = cartItems.find(
          (item) => item.products[0].product === productId
        );
  
        if (existingItem) {
          existingItem.products[0].quantity += 1;
  
          await axios.put(
            `http://localhost:4000/api/cart/${existingItem._id}`,
            { quantity: existingItem.products[0].quantity },
            { headers }
          );
        } else {
          await axios.post(
            'http://localhost:4000/api/cart',
            { product: productId },
            { headers }
          );
        }
  
        fetchCartItems(); // Fetch updated cart items after adding to cart
      } else {
        console.error('Authentication token not available');
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };
  
  

  const totalPrice = cartItems.reduce((total, item) => {
    return (
      total +
      item.products.reduce((itemTotal, product) => {
        const productPrice = parseFloat(product.productPrice);
        const quantity = parseFloat(product.quantity);
        return itemTotal + productPrice * quantity;
      }, 0)
    );
  }, 0);

  // ...

const handleCheckout = async () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      
      const response = await axios.post(
        'http://localhost:4000/api/orders/checkout',
        {
          sessionUrl: window.location.href, // Pass the current URL as the session URL
        },
        { headers }
      );

      const { sessionUrl } = response.data;
      // Redirect the user to the Stripe payment URL
      window.location.href = sessionUrl;
    } else {
      console.error('Authentication token not available');
    }
  } catch (error) {
    console.error('Error during checkout:', error);
  }
};

// ...


  return (
    <div>
      <h1>Cart</h1>
      <div>
        {cartItems.map((item) => {
          const uniqueProducts = Array.from(new Set(item.products.map((product) => product.product)));
          return (
            <Card key={item._id}>
              <Card.Body>
                {uniqueProducts.map((productId) => {
                  const product = item.products.find((product) => product.product === productId);
                  return (
                    <div key={product._id}>
                      <Card.Title>Name: {product.productName}</Card.Title>
                      <Card.Text>Price: ${product.productPrice}</Card.Text>
                      <Card.Text>Quantity: {product.quantity}</Card.Text>
                      <Button
                        variant="danger"
                        onClick={() => handleRemoveFromCart(item._id)}
                      >
                        Remove from Cart
                      </Button>
                      <Form.Group controlId={`formQuantity_${product._id}`}>
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control
                          type="number"
                          min={1}
                          value={product.quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              item._id,
                              parseInt(e.target.value)
                            )
                          }
                        />
                      </Form.Group>
                    </div>
                  );
                })}
                <Button
                  variant="primary"
                  onClick={() => handleAddToCart(item.products[0].product)}
                >
                  Add to Cart
                </Button>
              </Card.Body>
            </Card>
          );
        })}
      </div>
      <h3>Total: ${totalPrice.toFixed(2)}</h3>
      {cartItems.length > 0 && (
        <>
         
          <Button onClick={handleCheckout}>Checkout</Button>
        </>
      )}
    </div>
  );
  
  


};

export default Cart;
