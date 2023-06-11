import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]);

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

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const productIds = order?.products.map((product) => product.product);
        const productPromises = productIds.map((productId) =>
          axios.get(`http://localhost:4000/api/products/${productId}`, {
            headers: {
              Authorization: `Bearer ${token}`, // Include the authorization header
            },
          })
        );
        const productResponses = await Promise.all(productPromises);
        const productData = productResponses.map((response) => response.data);
        setProducts(productData);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };
    

    if (order && order.products.length > 0) {
      fetchProductDetails();
    }
  }, [order]);

  if (!order || products.length === 0) {
    return <p>Loading order details...</p>;
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <h2>Order Details</h2>
      <h4>Order ID: {order._id}</h4>
      <p>Date Ordered: {formatDate(order.createdAt)}</p>
      <p>Total Price: ${order.totalPrice}</p>
      <p>Status: {order.status}</p>
      <h4>Products:</h4>
      <ul>
        {products.map((product, index) => (
          <li key={order.products[index]._id}>
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{ width: '400px', height: '400px', objectFit: 'cover' }}
            />
            <h5>Name: {product.name}</h5>
            <p>Price: ${product.price}</p>
            <p>Quantity: {order.products[index].quantity}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderDetails;
