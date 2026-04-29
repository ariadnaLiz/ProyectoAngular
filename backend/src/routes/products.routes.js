const express = require('express');
const router = express.Router();
const { getProductos } = require('../controllers/products.controllers');

router.get('/productos', getProductos);

module.exports = router;