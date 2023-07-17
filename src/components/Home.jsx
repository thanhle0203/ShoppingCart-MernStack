import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Button, Row, Col, Card, Form, Modal } from 'react-bootstrap';
import bannerImage from '../resources/images/banner.jpg';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import StarRating from './StarRating';
import { Link } from 'react-router-dom';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/products');
      setProducts(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      console.log('token: ', token)
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

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchKeyword.trim() === '') {
      fetchProducts();
    } else {
      try {
        const response = await axios.get(`http://localhost:4000/api/products/search-products?keyword=${searchKeyword}`);
        setProducts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error searching products:', error);
      }
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

  return (
    <Container>
      <h2>Welcome to the Shopping Cart App!</h2>
      <img src={bannerImage} alt="Banner" style={{ width: '100%', height: '300px' }} />

      <br />

      <Row className="my-4">
        <Col md={10}>
          <Form onSubmit={handleSearch} className="d-flex">
            <Form.Control
              type="text"
              placeholder="Search for Products"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <Button variant="primary" type="submit" className="ml-4">
              Search
            </Button>
          </Form>
        </Col>
      </Row>

      <Button variant="primary" onClick={() => alert('Button clicked!')}>
        Shop Now
      </Button>

      <br /><br />

      <h3>Products:</h3>
      <Row>
        {products.map((product) => (
          <Col key={product._id} md={4}>
            <Card className="mb-4">
                <Link to={`/products/${product._id}`}> {/* Add Link component and specify the URL */}
                  <Card.Img
                    variant="top"
                    src={product.imageUrl}
                    alt={product.name}
                    style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                  />
                </Link>
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>{product.description}</Card.Text>
                <Card.Text>Category: {product.category}</Card.Text>
                {product.reviews && (
                  <div className='d-flex' align-items-center>
                    <span className='mr-2'>               
                    <StarRating rating={calculateAverageRating(product.reviews)} />        
                    </span>

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
          </Col>
        ))}
      </Row>

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

export default Home;
