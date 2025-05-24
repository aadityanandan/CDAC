const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.signupUser = async (req, res) => {
    try {
        console.log("Incoming Request Body:", req.body);

        const { name, email, telephone, deptName, password, confirmPassword } = req.body;

        // Validate input
        if (!name || !email || !telephone || !deptName || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        console.log("Checking if username exists...");
        const [rows] = await db.promise().query('SELECT * FROM signup_details WHERE name = ?', [name]);
        console.log("Query result:", rows);

        if (rows.length > 0) {
            return res.status(400).json({ message: "Username already taken" });
        }

        console.log("Hashing password...");
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log("Saving user to database...");
        const insertQuery = `
            INSERT INTO signup_details (name, email, telephone, deptName, password)
            VALUES (?, ?, ?, ?, ?)
        `;
        await db.promise().query(insertQuery, [name, email, telephone, deptName, hashedPassword]);

        console.log("User registered successfully.");
        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error("Error in signup:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
