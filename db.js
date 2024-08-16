// db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost', // or your MySQL host
    user: 'root',      // your MySQL username
    password: '', // your MySQL password
    database: 'yourDatabase'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

module.exports = connection;
