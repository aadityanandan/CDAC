const app = require('./app');

const connection = require('./config/db'); // Make sure the path is correct;

const PORT = 5000;

app.listen( PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}`);
});

