const mysql = require('mysql2');
require ('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
Connection.connect((err) => {
    if(error){
        console.error('Error al conectar MySQL', err);
        return;
    }
    console.log('Conexión a MySQL exitosa');
});

module.exports = connection;