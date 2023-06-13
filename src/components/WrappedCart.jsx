import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Cart from './Cart';

const WrappedCart = () => {
  const stripePromise = loadStripe('pk_test_8B9VvZ6OI2wjUnICvr2qArjv'); // Replace with your actual Stripe Publishable Key

  return (
    <Elements stripe={stripePromise}>
      {/* <Cart /> */}
    </Elements>
  );
};

export default WrappedCart;
