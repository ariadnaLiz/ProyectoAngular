const express = require('express');
const router = express.Router();
const { getProductos } = require('../contollers/products.controllers');

router.get('/', getProductos);

module.exports = router;