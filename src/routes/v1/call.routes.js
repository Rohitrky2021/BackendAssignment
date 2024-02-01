const express = require('express');
const router = express.Router();
const twilioService = require('../../../src/services/twilio/voice/index');

router.post('/', async (req, res) => {
  const { to } = req.body; // Assuming you're sending 'to' in the request body

  try {
    const [call, error] = await twilioService.createCall({ to });

    if (call) {
      res.status(200).json({ message: 'Call initiated successfully', call });
    } else {
      res.status(500).json({ message: 'Failed to initiate call', error });
    }
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

module.exports = router;
