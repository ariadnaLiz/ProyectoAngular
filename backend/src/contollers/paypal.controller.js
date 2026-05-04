const { createPaypalOrder, capturePaypalOrder } = require('../services/paypal.services');

async function createOrder(req, res) {
  try {
    const order = await createPaypalOrder(req.body);
    const approveLink = order.links.find(link => link.rel === 'approve');
    res.json({
      id: order.id,
      status: order.status,
      approveUrl: approveLink?.href
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error al crear la orden de PayPal',
      detail: error.message
    });
  }
}

async function captureOrder(req, res) {
  try {
    const { orderId } = req.params;
    const capture = await capturePaypalOrder(orderId);
    res.json(capture);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error al capturar la orden de PayPal',
      detail: error.message
    });
  }
}

module.exports = { createOrder, captureOrder };