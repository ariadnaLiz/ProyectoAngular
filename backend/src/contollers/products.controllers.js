const db = require('../config/db');

const getProductos = (req, res) => {
    const query = 'SELECT * FROM productos';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener productos' });
        }
        res.json(results);
    });
};

module.exports = {
    getProductos
};