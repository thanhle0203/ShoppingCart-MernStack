import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardGroup, Button, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Product = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/products');
        const populatedProducts = await Promise.all(response.data.map(async (product) => {
          const populatedProductResponse = await axios.get(`http://localhost:4000/api/products/${product._id}/reviews`);
          const populatedProduct = {
            ...product,
            reviews: populatedProductResponse.data,
          };
          return populatedProduct;
        }));
        setProducts(populatedProducts);
        console.log(populatedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    
    

    fetchProducts();
  }, []);

  const getCardStyle = (index) => {
    const shadowColors = ['bg-primary', 'bg-secondary', 'bg-success', 'bg-danger', 'bg-warning', 'bg-info'];
    const bgColors = ['bg-light', 'bg-white'];
    const shadowColor = shadowColors[index % shadowColors.length];
    const bgColor = bgColors[index % bgColors.length];
    return `${shadowColor} ${bgColor}`;
  };

  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Handle the case where the user is not authenticated
        console.error('User not authenticated');
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      await axios.post('http://localhost:4000/api/cart', {
        product: productId,
        quantity: 1 // You can adjust the quantity as needed
      }, { headers });

      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  return (
    <Container>
      <h2>Product List</h2>
      <Row>
        {products.map((product, index) => (
          <Col key={product._id} md={4}>
            <Card className={`mb-4 ${getCardStyle(index)}`}>
              <Card.Img
                variant="top"
                src={product.imageUrl}
                alt={product.name}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>{product.description}</Card.Text>
                <Card.Text>Category: {product.category}</Card.Text>
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
    </Container>
  );
};

export default Product;
