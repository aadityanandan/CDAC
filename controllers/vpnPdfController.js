// const puppeteer = require('puppeteer');
// const fs = require('fs');
// const path = require('path');
// const connection = require('../config/db'); // Should be from mysql2/promise
// const imageToBase64 = require('image-to-base64');

// // ✅ Promise-based query function
// async function queryDatabase(query, params) {
//     try {
//         const [rows] = await connection.query(query, params);
//         return rows;
//     } catch (err) {
//         console.error('Database query error:', err);
//         throw err;
//     }
// }

// exports.generateVpnPdfFromUuid = async (req, res) => {
//     const { uuid } = req.params;

//     try {
//         // ✅ Validate UUID
//         if (!uuid || typeof uuid !== 'string') {
//             console.error('Invalid UUID:', uuid);
//             return res.status(400).send('Invalid UUID provided.');
//         }

//         console.log('Generating PDF for UUID:', uuid);

//         // ✅ Fetch VPN details
//         const vpnResults = await queryDatabase(
//             `SELECT * FROM vpn_details WHERE uuid = ?`,
//             [uuid]
//         );

//         if (vpnResults.length === 0) {
//             return res.status(404).send('VPN details not found.');
//         }

//         const vpnDetails = vpnResults[0];

//         // ✅ Fetch server details for the UUID
//         const serverResults = await queryDatabase(
//             `SELECT serverIP, serverLocation, serverPort, serverDescription 
//              FROM vpn_details 
//              WHERE uuid = ? AND serverIP IS NOT NULL`,
//             [uuid]
//         );

//         // ✅ Load static HTML for terms & conditions
//         const staticPagePath = path.join(__dirname, '../views/dashboard/vpntac.html');
//         const staticContent = fs.readFileSync(staticPagePath, 'utf8');

//         // ✅ Convert logos to base64
//         const cdacLogoBase64 = await imageToBase64(
//             path.resolve(__dirname, '../pics/cdac-logo.png')
//         );
//         const jakegaLogoBase64 = await imageToBase64(
//             path.resolve(__dirname, '../pics/logo.png')
//         );

//         // ✅ Construct HTML
//         const htmlContent = `
// <html>
// <head>
//     <title>VPN Form</title>
//     <style>
//         body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.5; }
//         h2 { text-align: center; margin-bottom: 20px; }
//         .section { margin-bottom: 40px; }
//         .section-title { font-size: 20px; font-weight: bold; text-decoration: underline; margin-bottom: 10px; }
//         table { width: 100%; border-collapse: collapse; margin-bottom: 20px; table-layout: auto; }
//         th, td { border: 1px solid #ddd; padding: 10px; text-align: left; word-wrap: break-word; white-space: pre-wrap; vertical-align: top; }
//         th { background-color: #f4f4f4; }
//         img { max-height: 70px; }
//         li { margin: 10px 0; }
//     </style>
// </head>
// <body>
//     <h2>VPN Application Form</h2>

//     <!-- Personal Details Section -->
//     <div class="section">
//         <div class="section-title">Personal Details</div>
//         <table>
//             <tr><td style="width:170px">Name:</td><td>${vpnDetails.Name || 'N/A'}</td></tr>
//             <tr><td>Designation:</td><td>${vpnDetails.Designation || 'N/A'}</td></tr>
//             <tr><td>Email:</td><td>${vpnDetails.Email || 'N/A'}</td></tr>
//             <tr><td>Phone Number:</td><td>${vpnDetails.phoneNumber || 'N/A'}</td></tr>
//         </table>
//     </div>

//     <!-- Department Details Section -->
//     <div class="section">
//         <div class="section-title">Department Details</div>
//         <table>
//             <tr><td style="width:170px">Department Name:</td><td>${vpnDetails.deptName || 'N/A'}</td></tr>
//             <tr><td>Department State:</td><td>${vpnDetails.deptState || 'N/A'}</td></tr>
//             <tr><td>Department Phone:</td><td>${vpnDetails.deptPhNum || 'N/A'}</td></tr>
//             <tr><td>Department Address:</td><td>${vpnDetails.deptAddrs || 'N/A'}</td></tr>
//         </table>
//     </div>

//     <!-- Server Details Section -->
//     <div class="section">
//         <div class="section-title">Server Details</div>
//         <table>
//             <tr>
//                 <th>Server IP</th>
//                 <th>Server Location</th>
//                 <th>Server Port</th>
//                 <th>Server Description</th>
//             </tr>
//             ${serverResults.map(server => `
//                 <tr>
//                     <td>${server.serverIP || 'N/A'}</td>
//                     <td>${server.serverLocation || 'N/A'}</td>
//                     <td>${server.serverPort || 'N/A'}</td>
//                     <td>${server.serverDescription || 'N/A'}</td>
//                 </tr>
//             `).join('')}
//         </table>
//     </div>

//     <!-- Terms and Conditions -->
//     <div class="section">
//         <div class="section-title">Terms and Conditions</div>
//         <p>${staticContent}</p>
//     </div>
// </body>
// </html>
// `;

//         // ✅ Launch Puppeteer
//         const browser = await puppeteer.launch({
//             headless: true,
//             args: ['--no-sandbox', '--disable-setuid-sandbox'],
//         });

//         const page = await browser.newPage();

//         await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

//         // ✅ Generate the PDF
//         const pdfBuffer = await page.pdf({
//             format: 'A4',
//             printBackground: true,
//             displayHeaderFooter: true,
//             headerTemplate: `
// <div style="font-size:10px; color:#555; width:100%; padding:0 50px;">
//     <div style="display:flex; justify-content:space-between; align-items:center;">
//         <img src="data:image/png;base64,${cdacLogoBase64}" style="height:40px;" />
//         <img src="data:image/png;base64,${jakegaLogoBase64}" style="height:42px;" />
//     </div>
// </div>`,
//             footerTemplate: `
// <div style="font-size:10px; color:#555; width:100%; padding:0 50px; display:flex; justify-content:space-between;">
//     <div>
//         <strong>© 2024 Designed and developed by C-DAC Thiruvananthapuram</strong><br>
//         All rights reserved.
//     </div>
//     <div>
//         Page <span class="pageNumber"></span> of <span class="totalPages"></span>
//     </div>
// </div>`,
//             margin: {
//                 top: '70px',
//                 bottom: '50px',
//                 right: '30px',
//                 left: '40px',
//             },
//         });

//         // ✅ Send the PDF response
//         res.setHeader('Content-Type', 'application/pdf');
//         res.setHeader('Content-Disposition', 'inline');
//         res.setHeader('Content-Length', pdfBuffer.length);
//         res.end(pdfBuffer);

//         await browser.close();

//     } catch (error) {
//         console.error('Error generating VPN PDF:', error);
//         res.status(500).send('Error generating the VPN PDF.');
//     }
// };



const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const connection = require('../config/db'); // ✅ Promise pool
const imageToBase64 = require('image-to-base64');

// ✅ Helper: query database safely
async function queryDatabase(query, params = []) {
  try {
    const [rows] = await connection.query(query, params);
    return rows;
  } catch (err) {
    console.error('❌ Database query error:', err);
    throw err;
  }
}

// ✅ Route handler
exports.generateVpnPdfFromUuid = async (req, res) => {
  const { uuid } = req.params;

  try {
    if (!uuid || typeof uuid !== 'string') {
      console.error('⚠️ Invalid UUID received:', uuid);
      return res.status(400).send('Invalid UUID provided.');
    }

    console.log('📄 Generating VPN PDF for UUID:', uuid);

    // Fetch VPN details
    const vpnResults = await queryDatabase(
      `SELECT * FROM vpn_details WHERE uuid = ?`,
      [uuid]
    );

    if (vpnResults.length === 0) {
      return res.status(404).send('VPN details not found.');
    }

    const vpnDetails = vpnResults[0];

    // Fetch server details
    const serverResults = await queryDatabase(
      `SELECT serverIP, serverLocation, serverPort, serverDescription
       FROM vpn_details
       WHERE uuid = ? AND serverIP IS NOT NULL`,
      [uuid]
    );

    // Load static HTML for terms
    const staticPagePath = path.join(__dirname, '../views/dashboard/vpntac.html');
    const staticContent = fs.readFileSync(staticPagePath, 'utf8');

    // Convert logos to base64
    const cdacLogoBase64 = await imageToBase64(path.resolve(__dirname, '../public/pics/cdac-logo.png'));
    const jakegaLogoBase64 = await imageToBase64(path.resolve(__dirname, '../public/pics/logo.png'));

    // Build HTML
    const htmlContent = `
<html>
<head>
  <title>VPN Application Form</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.5; }
    h2 { text-align: center; margin-bottom: 20px; }
    .section { margin-bottom: 40px; }
    .section-title { font-size: 20px; font-weight: bold; text-decoration: underline; margin-bottom: 10px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; table-layout: auto; }
    th, td { border: 1px solid #ddd; padding: 10px; text-align: left; word-wrap: break-word; white-space: pre-wrap; vertical-align: top; }
    th { background-color: #f4f4f4; }
    img { max-height: 70px; }
    li { margin: 10px 0; }
  </style>
</head>
<body>
  <h2>VPN Application Form</h2>

  <!-- Personal Details -->
  <div class="section">
    <div class="section-title">Personal Details</div>
    <table>
      <tr><td style="width:170px">Name:</td><td>${vpnDetails.Name || 'N/A'}</td></tr>
      <tr><td>Designation:</td><td>${vpnDetails.Designation || 'N/A'}</td></tr>
      <tr><td>Email:</td><td>${vpnDetails.Email || 'N/A'}</td></tr>
      <tr><td>Phone Number:</td><td>${vpnDetails.phoneNumber || 'N/A'}</td></tr>
    </table>
  </div>

  <!-- Department Details -->
  <div class="section">
    <div class="section-title">Department Details</div>
    <table>
      <tr><td style="width:170px">Department Name:</td><td>${vpnDetails.deptName || 'N/A'}</td></tr>
      <tr><td>Department State:</td><td>${vpnDetails.deptState || 'N/A'}</td></tr>
      <tr><td>Department Phone:</td><td>${vpnDetails.deptPhNum || 'N/A'}</td></tr>
      <tr><td>Department Address:</td><td>${vpnDetails.deptAddrs || 'N/A'}</td></tr>
    </table>
  </div>

  <!-- Server Details -->
  <div class="section">
    <div class="section-title">Server Details</div>
    <table>
      <tr>
        <th>Server IP</th>
        <th>Server Location</th>
        <th>Server Port</th>
        <th>Server Description</th>
      </tr>
      ${serverResults.map(s => `
        <tr>
          <td>${s.serverIP || 'N/A'}</td>
          <td>${s.serverLocation || 'N/A'}</td>
          <td>${s.serverPort || 'N/A'}</td>
          <td>${s.serverDescription || 'N/A'}</td>
        </tr>`).join('')}
    </table>
  </div>

  <!-- Terms -->
  <div class="section">
    <div class="section-title">Terms and Conditions</div>
    ${staticContent}
  </div>
</body>
</html>`;

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: `
<div style="font-size:10px; color:#555; width:100%; padding:0 50px;">
  <div style="display:flex; justify-content:space-between; align-items:center;">
    <img src="data:image/png;base64,${cdacLogoBase64}" style="height:40px;" />
    <img src="data:image/png;base64,${jakegaLogoBase64}" style="height:42px;" />
  </div>
</div>`,
      footerTemplate: `
<div style="font-size:10px; color:#555; width:100%; padding:0 50px; display:flex; justify-content:space-between;">
  <div>
    <strong>© 2024 Designed and developed by C-DAC Thiruvananthapuram</strong><br>
    All rights reserved.
  </div>
  <div>
    Page <span class="pageNumber"></span> of <span class="totalPages"></span>
  </div>
</div>`,
      margin: {
        top: '70px',
        bottom: '50px',
        right: '30px',
        left: '40px',
      },
    });

    // Send PDF response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Content-Length', pdfBuffer.length);
    res.end(pdfBuffer);

    await browser.close();
    console.log('✅ VPN PDF generated successfully for UUID:', uuid);

  } catch (error) {
    console.error('❌ Error generating VPN PDF:', error);
    res.status(500).send('Error generating the VPN PDF.');
  }
};
