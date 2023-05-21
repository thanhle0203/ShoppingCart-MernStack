import store from './store'; // Update the import statement
import React from 'react';
import { Provider } from 'react-redux';
import App from './App';

import { createRoot } from 'react-dom';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);


