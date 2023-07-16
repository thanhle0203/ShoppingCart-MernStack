import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Button, Row, Col, Card, Form, Modal } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import StarRating from './StarRating';

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);

  console.log("productId: ", productId)
  console.log("product: ", product)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/products/${productId}`);
         

        setProduct(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
  
    fetchProduct();
  }, [productId]);

  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.post(
          'http://localhost:4000/api/cart',
          { product: productId },
          { headers }
        );

        if (response.data.cartItem) {
          setCartItems((prevCartItems) => [...prevCartItems, response.data.cartItem]);
          alert('Item added to cart successfully!');
        } else {
          alert('Failed to add item to cart. Please try again.');
        }
      } else {
        console.error('Authentication token not available');
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    }
  };
  
  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) {
      return 'N/A';
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    console.log("averageRating: ", averageRating)

    return averageRating.toFixed(1);
  };

  const handleViewComments = async (productId) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/products/comments/${productId}`)
      const comments = response.data;
      setComments(comments);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  if (!product) {
    return (
      <Container>
        <h2>Loading...</h2>
      </Container>
    );
  }

  return (
    <Container>
      <h2>Product Detail</h2>
      <div>

      <Card>
        <Card.Img variant="top" src={product.imageUrl} alt={product.name} style={{ width: '400px', height: '400px', objectFit: 'cover' }} />
        <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>{product.description}</Card.Text>
                <Card.Text>Category: {product.category}</Card.Text>
                {product.reviews && (
                  <div className='d-flex' align-items-center>
                   
                           
                    <StarRating rating={calculateAverageRating(product.reviews)} />        
                    
                    {/* {calculateAverageRating(product.reviews)} */}
                    <span className='ml-2 mr-2' style={{ marginLeft: '0.5rem' }}></span>
                    <span className='ml-2 mr-2'
                      style={{ cursor: 'pointer', textDecoration: 'underline' }}
                      onClick={() => handleViewComments(product._id)}
                    >
                      {product.reviews.length || 0}
                    </span>     
                  </div>
                 )} 

                <Card.Text>Price: ${product.price}</Card.Text>
                <Button
                  variant="primary"
                  onClick={() => handleAddToCart(product._id)}
                >
                  Add to Cart
                </Button>
              </Card.Body>
      </Card>


      </div>

      {comments.length > 0 && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Comments</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {comments.map((comment) => (
              <div key={comment._id}>
                <p>{comment.comment}</p>
                <p>User: {comment.user}</p>
              </div>
            ))}
          </Modal.Body>

          <Modal.Footer>
            <Button variant='secondary' onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default ProductDetail;
