import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Button, Row, Col, Card, Form } from 'react-bootstrap';
import bannerImage from '../resources/images/banner.jpg'; // Import the banner image

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await axios.post('http://localhost:4000/api/cart', {
        product: productId,
        quantity: 1 // You can adjust the quantity as needed
      });
      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchKeyword.trim() === '') {
      fetchProducts(); // Reset to all products if the search keyword is empty
    } else {
      try {
        const response = await axios.get(`http://localhost:4000/api/products?keyword=${searchKeyword}`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error searching products:', error);
      }
    }
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
              <Card.Img
                variant="top"
                src={product.imageUrl}
                alt={product.name}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>Price: ${product.price}</Card.Text>
                <Card.Text>{product.description}</Card.Text>
                <Card.Text>Category: {product.category}</Card.Text>
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
    </Container>
  );
};

export default Home;
