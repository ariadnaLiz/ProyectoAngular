async function createOrder(req, res) {
  try {
    const order = await createPaypalOrder(req.body);

    const approveLink = order.links.find(link => link.rel === 'approve');

    res.json({
      id: order.id,
      status: order.status,
      approveUrl: approveLink.href
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error al crear la orden de PayPal',
      detail: error.message
    });
  }
}