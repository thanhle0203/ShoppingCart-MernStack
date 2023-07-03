import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Card } from 'react-bootstrap';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);


  console.log("id: ", id)
  console.log("order: ", order)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log("account token: ", token); // Check if the token is retrieved correctly

        if (token) {
          const headers = {
            Authorization: `Bearer ${token}`,
          };

          console.log('Headers:', headers);
          const response = await axios.get(`http://localhost:4000/api/orders/${id}`, { headers });

          setOrder(response.data);
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (!order) {
    return <p>Loading order details...</p>;
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  const formatPrice = (price) => {
    return price.toFixed(2);
  };

  return (
    <div>
      <h2>Order Details</h2>
      <Card>
        <Card.Body>
          <Card.Title>Order ID: {order._id}</Card.Title>
          <Card.Text>Date Ordered: {formatDate(order.createdAt)}</Card.Text>
          <Card.Text>Total Price: ${formatPrice(order.totalPrice)}</Card.Text>
          <Card.Text>Status: {order.status}</Card.Text>
        </Card.Body>
      </Card>
      
    </div>
  );
};

export default OrderDetails;
