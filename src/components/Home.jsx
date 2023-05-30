import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Button, Row, Col, Card } from 'react-bootstrap';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

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

  return (
    <Container>
      <h2>Welcome to the Shopping Cart App!</h2>
      <img src="../resources/images/banner.jpg" alt="Banner" />
      <p>Start shopping now!</p>
      <Button variant="primary" onClick={() => alert('Button clicked!')}>
        Shop Now
      </Button>
      <h3>Featured Products:</h3>
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
