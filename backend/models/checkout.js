// checkout.js

// Assuming you have a database connection, import the necessary models and libraries
const Order = require('./order');
const CartItem = require('./cartItem');
const PaymentGateway = require('../libraries/paymentGateway');

// Function to process the checkout
const processCheckout = async (cartItems, paymentInfo) => {
  try {
    // Create a new order with the cart items and payment information
    const order = new Order({
      cartItems,
      paymentInfo,
    });

    // Save the order to the database
    const savedOrder = await order.save();

    // Process the payment using a payment gateway library
    const paymentGateway = new PaymentGateway();
    const paymentResult = await paymentGateway.processPayment(paymentInfo);

    if (paymentResult.success) {
      // If payment is successful, update the order status to 'paid'
      savedOrder.status = 'paid';
      await savedOrder.save();

      // Remove the cart items from the database
      await CartItem.deleteMany({ _id: { $in: cartItems.map((item) => item._id) } });

      // Return the order and payment information
      return {
        order: savedOrder,
        paymentInfo: paymentResult.paymentInfo,
      };
    } else {
      // If payment fails, update the order status to 'payment failed'
      savedOrder.status = 'payment failed';
      await savedOrder.save();

      // Return an error message
      throw new Error('Payment failed. Please try again.');
    }
  } catch (error) {
    throw new Error('Error processing checkout: ' + error.message);
  }
};

module.exports = {
  processCheckout,
};
