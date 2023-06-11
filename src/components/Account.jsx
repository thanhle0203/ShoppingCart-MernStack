import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Account = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log("account token: ", token); // Check if the token is retrieved correctly
   
        const order = localStorage.getItem('order');
        console.log("Order details: ", order);

        if (token) {
          const headers = {
            Authorization: `Bearer ${token}`,
          };
    
          console.log('Headers:', headers);
          const response = await axios.get('http://localhost:4000/api/orders', { headers });
        
          setOrders(response.data);
          console.log("Order data:", response)
        }

        // Clear the saved order from local storage
       localStorage.removeItem('order');
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

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
              <p>Date Ordered: {formatDate(order.createdAt)}</p>
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
