const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mydb',
  waitForConnections: true,
  connectionLimit: 1000,
  queueLimit: 0
});

module.exports = pool.promise();  
