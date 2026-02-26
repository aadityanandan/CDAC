// const app = require('./app');

// const connection = require('./config/db'); // Make sure the path is correct;

// const port = process.env.PORT || 3000;

// const host = '0.0.0.0'

// // process.env.HTTP_PROXY = "http://192.168.13.176:54845";
// // process.env.HTTPS_PROXY = "http://192.168.13.176:54845";
// // process.env.NO_PROXY = "localhost,127.0.0.1";

// app.listen(port, host, () => {
//     // console.log(`Server running on port ${port}`);
//     console.log(`Server running on  http://${host}:${port}`);
// });


// require('dotenv').config();  // Load the .env variables

// const fs = require('fs');
// const https = require('https');
// const app = require('./app'); // Your Express app

// // Paths to your SSL files
// const keyPath = 'E:/SSL/jk.gov.in.key';        // Path to your private key
// const certPath = 'E:/SSL/star_jk_gov_in.crt';      // Path to your domain certificate
// // const chainPath = 'E:/SSL/combined_cert_chain.pem';  // Combined certificate chain

// const port = process.env.PORT || 443;
// const host = '0.0.0.0';

// // Read the SSL files
// const httpsOptions = {
//     key: fs.readFileSync(keyPath),          // The private key
//     cert: fs.readFileSync(certPath),        // The domain certificate
//     // ca: fs.readFileSync(chainPath),         // The certificate chain
//     passphrase: process.env.PFX_PASSPHRASE || 'defaultPassphrase',  // The passphrase for the private key (if needed)
// };

// // Start HTTPS server
// https.createServer(httpsOptions, app).listen(port, host, () => {
//     console.log(`Server running on https://${host}:${port}`);
// });




require('dotenv').config();

const http = require('http');
const app = require('./app'); // Express app

const port = process.env.PORT || 3000;
const host = '127.0.0.1'; // localhost

http.createServer(app).listen(port, host, () => {
  console.log(`Server running on http://${host}:${port}`);
});


