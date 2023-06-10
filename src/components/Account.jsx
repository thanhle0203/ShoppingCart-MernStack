import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Account = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log(token); // Check if the token is retrieved correctly

        if (token) {
          const response = await axios.get('http://localhost:4000/api/orders', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setOrders(response.data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order._id}>
              <h4>Order ID: {order._id}</h4>
              <p>Total Price: ${order.totalPrice}</p>
              <p>Status: {order.status}</p>
              <a href={`/order/${order._id}`}>View Details</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Account;
