import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Card } from 'react-bootstrap';

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
      <h4>Products:</h4>
      <div className="d-flex flex-wrap">
        {products.map((product, index) => (
          <Card key={order.products[index]._id} className="m-2" style={{ width: '200px' }}>
            <Card.Img
              variant="top"
              src={product.imageUrl}
              alt={product.name}
              style={{ height: '200px', objectFit: 'cover' }}
            />
            <Card.Body>
              <Card.Title>Name: {product.name}</Card.Title>
              <Card.Text>Price: ${formatPrice(product.price)}</Card.Text>
              <Card.Text>Quantity: {order.products[index].quantity}</Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrderDetails;
