const app = require('./app');

// const connection = require('./config/db'); // Make sure the path is correct;

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
