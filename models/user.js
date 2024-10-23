const db = require('../config/db'); 

// Find user by email
exports.findUserByEmail = (email, callback) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], callback);
};

// Create a new user
exports.createUser = (email, hashedPassword, callback) => {
    const sql = 'INSERT INTO users (email, password, verified) VALUES (?, ?, false)';
    db.query(sql, [email, hashedPassword], callback);
};

// Verify the user's email
exports.verifyUserEmail = (email, callback) => {
    const sql = 'UPDATE users SET verified = true WHERE email = ?';
    db.query(sql, [email], callback);
};
