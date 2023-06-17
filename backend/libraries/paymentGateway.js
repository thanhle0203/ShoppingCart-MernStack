const dotenv = require('dotenv');
dotenv.config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class PaymentGateway {
  async processPayment(paymentInfo) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: paymentInfo.amount,
        currency: paymentInfo.currency,
        payment_method: paymentInfo.paymentMethodId,
        confirm: true,
      });

      if (paymentIntent.status === 'succeeded') {
        return {
          success: true,
          paymentInfo: {
            paymentIntentId: paymentIntent.id,
            paymentDate: paymentIntent.created,
            transactionId: paymentIntent.charges.data[0].id,
            cardBrand: paymentIntent.charges.data[0].payment_method_details.card.brand,
            cardLast4: paymentIntent.charges.data[0].payment_method_details.card.last4,
          },
        };
      } else {
        return {
          success: false,
          error: 'Payment failed. Please try again.',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Error processing payment: ' + error.message,
      };
    }
  }
}

module.exports = PaymentGateway;
