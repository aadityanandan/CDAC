const mysql = require('mysql2');

// Create a single connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',    
    password: '',   
    database: 'mydb',
});

// Connect to the MySQL database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

// Export the connection
module.exports = connection;
