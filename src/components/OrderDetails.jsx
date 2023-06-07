import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderDetails = ({ match }) => {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`/api/orders/${match.params.id}`);
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    fetchOrderDetails();
  }, [match.params.id]);

  if (!order) {
    return <p>Loading order details...</p>;
  }

  return (
    <div>
      <h2>Order Details</h2>
      <h4>Order ID: {order._id}</h4>
      <p>Total Price: ${order.totalPrice}</p>
      <p>Status: {order.status}</p>
      <h4>Products:</h4>
      <ul>
        {order.products.map((product) => (
          <li key={product._id}>
            <h5>{product.product.name}</h5>
            <p>Price: ${product.product.price}</p>
            <p>Quantity: {product.quantity}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderDetails;
