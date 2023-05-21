import React from "react";
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import {Home} from "./components/Home";
import {Cart}  from "./components/Cart";
import {Product}  from "./components/Product";
import  {User}  from "./components/User";
import  {Coupon}  from "./components/Coupon";
import  {Checkout}  from "./components/Checkout";

const App = () => {
  return (
    <Router>
      <div>
        {/* Header Component */}
        <header>
          <h1>Shopping Cart App</h1>

          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/cart">Cart</Link>
              </li>
              <li>
                <Link to="/product">Product</Link>
              </li>
              <li>
                <Link to="/user">User</Link>
              </li>
              <li>
                <Link to="/coupon">Coupon</Link>
              </li>
              <li>
                <Link to="/checkout">Checkout</Link>
              </li>
              
            </ul>
          </nav>
        </header>

        {/* Main Conten */}
        <main>
          <Routes>
            <Route exact path="/" component={Home}/>
            <Route path="/cart" component={Cart}/>
            <Route path="/product" component={Product}/>
            <Route path="/user" component={User}/>
            <Route path="/coupon" component={Coupon}/>
            <Route path="/checkout" component={Checkout}/>
          </Routes>
        </main>

        {/* Footer Componenet */}
        <footer>
          <p>&copy; {new Date().getFullYear()} Shopping Cart App</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
