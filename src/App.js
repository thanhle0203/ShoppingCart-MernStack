// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './components/Home';
import Cart from './components/Cart';
import Product from './components/Product';
import User from './components/User';
import Coupon from './components/Coupon';
import Checkout from './components/Checkout';

const App = () => {
  return (
    <Router>
      <div>
        {/* Header Component */}
        <Navbar bg="dark" variant="dark" expand="lg">
  <Container>
    <Navbar.Brand as={Link} to="/">
      Shopping Cart App
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="navbar-nav" />
    <Navbar.Collapse id="navbar-nav">
      <Nav className="mr-auto">
        <Nav.Link as={Link} to="/">
          Home
        </Nav.Link>
        <Nav.Link as={Link} to="/cart">
          Cart
        </Nav.Link>
        <Nav.Link as={Link} to="/product">
          Product
        </Nav.Link>
        <Nav.Link as={Link} to="/user">
          User
        </Nav.Link>
        <Nav.Link as={Link} to="/coupon">
          Coupon
        </Nav.Link>
        <Nav.Link as={Link} to="/checkout">
          Checkout
        </Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>



        {/* Main Content */}
        <Container className="mt-4">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/product" element={<Product />} />
            <Route path="/user" element={<User />} />
            <Route path="/coupon" element={<Coupon />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </Container>

        {/* Footer Component */}
        <footer className="bg-light text-center py-3">
          <p>&copy; {new Date().getFullYear()} Shopping Cart App</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
