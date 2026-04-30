const express = require('express');
const router = express.Router();
const { createOrder, captureOrder } = require('../contollers/paypal.controller');

router.post('/create-order', createOrder);
router.post('/capture-order/:orderId', captureOrder);

module.exports = router;