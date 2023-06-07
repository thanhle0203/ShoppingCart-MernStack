import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/orders/${orderId}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  if (!order) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h3>Order Details</h3>
      <p>Order ID: {order._id}</p>
      <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>

      <h4>Cart Items</h4>
      <ul>
      {order.cartItems.map((cartItem, index) => (
  <li key={`cart-item-${index}`}>
    <p>Product: {cartItem.productName}</p>
    <p>Price: {cartItem.productPrice}</p>
    <p>Quantity: {cartItem.quantity}</p>
  </li>
))}


</ul>



      {/* Display other order details here */}
    </div>
  );
};

export default OrderDetails;
