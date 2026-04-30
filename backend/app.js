const express = require('express');
const cors = require('cors');

const paypalRoutes = require('./src/routes/paypal.routes');
const productsRoutes = require('./src/routes/products.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/paypal', paypalRoutes);
app.use('/api/productos', productsRoutes);

module.exports = app;