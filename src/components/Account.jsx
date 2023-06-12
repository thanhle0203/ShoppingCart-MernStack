import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from 'react-bootstrap';

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

  const formatPrice = (price) => {
    return price.toFixed(2);
  }

  return (
    <div>
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="row">
          {orders.map((order) => (
            <div key={order._id} className="col-md-12">
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>Order ID: {order._id}</Card.Title>
                  <Card.Text>Date Ordered: {formatDate(order.createdAt)}</Card.Text>
                  <Card.Text>Total Price: ${formatPrice(order.totalPrice)}</Card.Text>
                  <Card.Text>Status: {order.status}</Card.Text>
                  <a href={`/order/${order._id}`}>View Details</a>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Account;
