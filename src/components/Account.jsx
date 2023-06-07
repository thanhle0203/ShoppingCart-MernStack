import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const Account = () => {
  const { orderId } = useParams();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const selectOrder = (orderId) => {
    const order = orders.find((order) => order._id === orderId);
    setSelectedOrder(order);
  };

  return (
    <div>
      <h2>My Orders</h2>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>
            <Link to={`/account/orders/${order._id}`} onClick={() => selectOrder(order._id)}>
              Order {order._id} - {new Date(order.createdAt).toLocaleDateString()}
            </Link>
          </li>
        ))}
      </ul>

      {selectedOrder && (
        <div>
          <h3>Order Details</h3>
          <p>Order ID: {selectedOrder._id}</p>
          <p>Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
          <p>Price: {selectedOrder.totalPrice}</p>

          <h4>Cart Items</h4>
          <ul>
            {selectedOrder.cartItems.map((cartItem) => (
              <li key={cartItem._id}>
                Product: {cartItem.productName}<br />
                Price: {cartItem.productPrice}<br />
                Quantity: {cartItem.quantity}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Account;
