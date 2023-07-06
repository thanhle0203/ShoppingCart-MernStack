import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Card, Button, Form } from 'react-bootstrap';
// import { Form } from 'react-bootstrap/lib/Navbar';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
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

  const handleRatingChange = (event) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value))
      setRating(value);
  }

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  }

  const handleSubmitReview = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem('token');

      if (token) {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        if (isNaN(rating) || rating < 1 || rating > 5) {
          console.error('Invalid rating value');
          return;
        }

        const reviewData = {
          rating, 
          comment,
          productId: order.products[0].product, 
        };

        console.log("reviewData: ", reviewData);

        const response = await axios.post(
          `http://localhost:4000/api/orders/reviews/${id}`,
          reviewData,
          { headers }
        );

        console.log("response:", response)

        // Update the order details with the new review
        setOrder((prevOrder) => ({
          ...prevOrder,
          review: response.data.review,
        }));

        // Clear the rating and comment fields
        setRating(0);
        setComment('');

      } 
    } catch (error) {
        console.error('Error submitting review:', error);
    }
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

      <h3>Write a Review</h3>
      {order.review ? (
        <p>You have already reviewed this product.</p>
      ) : (
        <Form onSubmit={handleSubmitReview}>
          <Form.Group controlId="rating">
            <Form.Label>Rating</Form.Label>
            <Form.Control as="select" value={rating} onChange={handleRatingChange}>
              <option value={0}>Select Rating...</option>
              <option value={1}>1 - Poor</option>
              <option value={2}>2 - Fair</option>
              <option value={3}>3 - Good</option>
              <option value={4}>4 - Very Good</option>
              <option value={5}>5 - Excellent</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="comment">
            <Form.Label>Comment</Form.Label>
            <Form.Control as="textarea"  rows={3} value={comment} onChange={handleCommentChange} />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit Review
          </Button>
        </Form>
      )}
      
    </div>
  );
};

export default OrderDetails;
