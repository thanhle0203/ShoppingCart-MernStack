import React, {useEffect, useState} from 'react';
import axios from 'axios';


const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from the server
    const fetchProducts = async() => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data);
      }
      catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (productId) => {
    // Implement the necessary logic to add the product to the cart
    console.log('Adding product to cart:', productId);
  };

  return (
    <div>
      <h2>Welcome to the Shopping Cart App!</h2>
      <img src="../resources/images/banner.jpg" alt="Banner" />
      <p>Start shopping now!</p>
      <button onClick={() => alert('Button clicked!')}>Shop Now</button>
      <h3>Featured Products:</h3>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            <h4>{product.name}</h4>
            <p>Price: ${product.price}</p>
             <p>{product.description}</p>     
             <img src={product.imageUrl} alt={product.name} />
             <p>Category: {product.category}</p>
             <button onClick={() => handleAddToCart(product._id)}>Add to Cart</button>
             <p>Quantity in Cart: {getProductQuantityInCart(product._id)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
