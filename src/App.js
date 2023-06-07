import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './components/Home';
import Cart from './components/Cart';
import Product from './components/Product';
import Coupon from './components/Coupon';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Account from './components/Account';
import OrderDetails from './components/OrderDetails';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogout = () => {
    setLoggedIn(false);
  };

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

            <Navbar.Collapse id="navbar-nav" className="justify-content-end">
              <Nav>
                <Nav.Link as={NavLink} to="/" exact="true">
                  Home
                </Nav.Link>

                <Nav.Link as={NavLink} to="/product">
                  Product
                </Nav.Link>

                {loggedIn ? (
                  <>
                    <Nav.Link as={NavLink} to="/account">
                      Account
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/logout" onClick={handleLogout}>
                      Log out
                    </Nav.Link>
                  </>
                ) : (
                  <Nav.Link as={NavLink} to="/login">
                    Sign in
                  </Nav.Link>
                )}

                <Nav.Link as={NavLink} to="/coupon">
                  Coupon
                </Nav.Link>

                <Nav.Link as={NavLink} to="/cart">
                  Cart
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* Main Content */}
        <Container className="mt-4">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/product" element={<Product />} />
            <Route path="/account" element={<Account />} />
            <Route path="/coupon" element={<Coupon />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/order/:id" element={<OrderDetails />} />
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
