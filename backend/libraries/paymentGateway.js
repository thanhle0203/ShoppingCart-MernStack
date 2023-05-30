const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class PaymentGateway {
  async processPayment(paymentInfo) {
    try {
      // Use the Stripe library to process the payment
      const paymentIntent = await stripe.paymentIntents.create({
        amount: paymentInfo.amount,
        currency: paymentInfo.currency,
        payment_method: paymentInfo.paymentMethodId,
        confirm: true,
      });

      // Check the status of the payment intent
      if (paymentIntent.status === 'succeeded') {
        // If payment is successful, return the payment result and any additional payment information
        return {
          success: true,
          paymentInfo: {
            paymentIntentId: paymentIntent.id,
            paymentDate: paymentIntent.created,
            transactionId: paymentIntent.charges.data[0].id,
            cardBrand: paymentIntent.charges.data[0].payment_method_details.card.brand,
            cardLast4: paymentIntent.charges.data[0].payment_method_details.card.last4,
            // Include any other payment-related information you want to return
          },
        };
      } else {
        // If payment fails, return the payment result with the failure reason
        return {
          success: false,
          error: 'Payment failed. Please try again.',
        };
      }
    } catch (error) {
      // If an error occurs during payment processing, return the error message
      return {
        success: false,
        error: 'Error processing payment: ' + error.message,
      };
    }
  }
}

module.exports = PaymentGateway;
