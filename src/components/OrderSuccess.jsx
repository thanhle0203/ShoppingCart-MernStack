import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, Navigate } from 'react-router-dom';

const OrderSuccess = () => {
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const sessionId = new URLSearchParams(location.search).get('session_id');
  console.log("sessionId: ", sessionId);

  useEffect(() => {
    if (sessionId) {
      axios
        .get(`http://localhost:4000/api/orders/success?session_id=${sessionId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then((response) => {
          setOrder(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error('Error fetching order details:', error);
          setOrder(null); // Reset the order state to null on error
        });
    }
  }, [sessionId]);

  if (!sessionId) {
    return <Navigate to="/" />;
  }

  if (order === null) {
    return <p>Loading...</p>;
  }

  if (!order) {
    return <p>Error retrieving order details.</p>;
  }

  return (
    <div>
      <h2>Order Details</h2>
      <p>Order ID: {order._id}</p>
      <p>Order Total: ${order.totalPrice.toFixed(2)}</p>
      {/* Add more order details as needed */}
    </div>
  );
};

export default OrderSuccess;
