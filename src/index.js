// import store from './store'; // Update the import statement
// import React from 'react';
// import { Provider } from 'react-redux';
// import App from './App';

// import { createRoot } from 'react-dom/client';


// createRoot(document.getElementById('root')).render(
//   <Provider store={store}>
//     <App />
//   </Provider>
// );

import React from 'react';
import ReactDOM from 'react-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import App from './App';

const stripePromise = loadStripe('pk_test_8B9VvZ6OI2wjUnICvr2qArjv'); // Replace with your actual Stripe Publishable Key

ReactDOM.render(
  <React.StrictMode>
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  </React.StrictMode>,
  document.getElementById('root')
);



