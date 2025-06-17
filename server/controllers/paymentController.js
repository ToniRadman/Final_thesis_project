const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

async function createPaymentIntent(req, res) {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Neispravan iznos' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // u centima
      currency: 'eur'
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Stripe error:', error.message);
    res.status(500).json({ error: 'Greška pri kreiranju plaćanja' });
  }
};

module.exports = { createPaymentIntent };