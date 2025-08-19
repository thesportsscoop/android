const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { reference } = req.body;
  if (!reference) {
    res.status(400).json({ error: 'Missing payment reference' });
    return;
  }
  const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ error: 'Verification failed', details: error.response?.data || error.message });
  }
};
