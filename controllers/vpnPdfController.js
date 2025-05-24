
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const connection = require('../config/db');
const imageToBase64 = require('image-to-base64');

// Database query helper
function queryDatabase(query, params) {
    return new Promise((resolve, reject) => {
        connection.query(query, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
}

exports.generateVpnPdfFromUuid = async (req, res) => {
    const { uuid } = req.params;
    try {
        // Validate UUID
        if (!uuid || typeof uuid !== 'string') {
            console.error('Invalid UUID:', uuid);
            return res.status(400).send('Invalid UUID provided.');
        }

        console.log('Generating PDF for UUID:', uuid); // Debug log

        // Fetch VPN details
        const vpnResults = await queryDatabase(
            `SELECT * FROM vpn_details WHERE uuid = ?`,
            [uuid]
        );
        if (vpnResults.length === 0) {
            return res.status(404).send('VPN details not found.');
        }
        const vpnDetails = vpnResults[0]; // Take the first row for personal/department details

        // Fetch all server details for this UUID
        const serverResults = await queryDatabase(
            `SELECT serverIP, serverLocation, serverPort, serverDescription 
             FROM vpn_details 
             WHERE uuid = ? AND serverIP IS NOT NULL`,
            [uuid]
        );

        // Fetch terms and conditions static content
        const staticPagePath = path.join(__dirname, '../views/dashboard/vpntac.html');
         const staticContent = fs.readFileSync(staticPagePath, 'utf8');


        // Convert images to base64
        const cdacLogoBase64 = await imageToBase64(path.resolve(__dirname, '../public/pics/cdac-logo.png'));
        const jakegaLogoBase64 = await imageToBase64(path.resolve(__dirname, '../public/pics/logo.png'));

        // Construct the HTML content for the VPN PDF
        const htmlContent = `
<html>
<head>
    <title>VPN Form</title>
    <style>
    body { 
        font-family: Arial, sans-serif; 
        margin: 20px; 
        line-height: 1.5; 
    }
    h2 { 
        text-align: center; 
        margin-bottom: 20px; 
    }
    .section { 
        margin-bottom: 40px; 
    }
    .section-title { 
        font-size:20px;
        font-weight: bold; 
        text-decoration: underline; 
        margin-bottom: 10px; 
    }
    table { 
        width: 100%; 
        border-collapse: collapse; 
        margin-bottom: 20px; 
        table-layout: auto;
    }
    th, td { 
        border: 1px solid #ddd; 
        padding: 10px; 
        text-align: left; 
        word-wrap: break-word;
        word-break: break-word;
        white-space: pre-wrap;
        vertical-align: top;
    }
    th { 
        background-color: #f4f4f4; 
    }
    img { 
        max-height: 70px; 
    }
    li {
        margin: 10px 0;
    }
    </style>
</head>
<body>
    <h2>VPN Application Form</h2>

    <!-- Personal Details Section -->
    <div class="section">
        <div class="section-title">Personal Details</div>
        <table>
            <tr>
                <td style="width:170px">Name:</td>
                <td>${vpnDetails.Name || 'N/A'}</td>
            </tr>
            <tr>
                <td>Designation:</td>
                <td>${vpnDetails.Designation || 'N/A'}</td>
            </tr>
            <tr>
                <td>Email:</td>
                <td>${vpnDetails.Email || 'N/A'}</td>
            </tr>
            <tr>
                <td>Phone Number:</td>
                <td>${vpnDetails.phoneNumber || 'N/A'}</td>
            </tr>
        </table>
    </div>

    <!-- Department Details Section -->
    <div class="section">
        <div class="section-title">Department Details</div>
        <table>
            <tr>
                <td style="width:170px">Department Name:</td>
                <td>${vpnDetails.deptName || 'N/A'}</td>
            </tr>
            <tr>
                <td>Department State:</td>
                <td>${vpnDetails.deptState || 'N/A'}</td>
            </tr>
            <tr>
                <td>Department Phone:</td>
                <td>${vpnDetails.deptPhNum || 'N/A'}</td>
            </tr>
            <tr>
                <td>Department Address:</td>
                <td>${vpnDetails.deptAddrs || 'N/A'}</td>
            </tr>
        </table>
    </div>

    <!-- Server Details Section -->
    <div class="section">
        <div class="section-title">Server Details</div>
        <table>
            <tr>
                <th>Server IP:</th>
                <th>Server Location:</th>
                <th>Server Port:</th>
                <th>Server Description:</th>
            </tr>
            ${serverResults.map(server => `
                <tr>
                    <td>${server.serverIP || 'N/A'}</td>
                    <td>${server.serverLocation || 'N/A'}</td>
                    <td>${server.serverPort || 'N/A'}</td>
                    <td>${server.serverDescription || 'N/A'}</td>
                </tr>
            `).join('')}
        </table>
    </div>

    <!-- Terms and Conditions Section -->
    <div class="section">
        <div class="section-title">Terms and Conditions</div>
        <p>${staticContent}</p>
    </div>
</body>
</html>
`;

        // Puppeteer setup
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        // Set content for the PDF
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        // Generate the PDF with header and footer
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            displayHeaderFooter: true,
            headerTemplate: `
    <div style="font-size:10px; color:#555; width:100%; padding:0 50px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
            <img src="data:image/png;base64,${cdacLogoBase64}" style="height:40px; margin-right:auto;" />
            <img src="data:image/png;base64,${jakegaLogoBase64}" style="height:42px; margin-left:auto;" />
        </div>
    </div>
`,
            footerTemplate: `
    <div style="font-size:10px; color:#555; width:100%; padding:0 50px; display:flex; justify-content:space-between; align-items:center;">
        <div style="text-align:left;">
            <strong>© 2024 Designed and developed by C-DAC Thiruvananthapuram</strong><br>
            All rights reserved.<br>
        </div>
        <div style="text-align:right; margin-right:10px">
            Page <span class="pageNumber"></span> of <span class="totalPages"></span>
        </div>
    </div>
`,
            margin: {
                top: '70px',
                bottom: '50px',
                right: '30px',
                left: '40px',
            },
        });

        // Send the PDF as a response (for online viewing)
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline');
        res.setHeader('Content-Length', pdfBuffer.length);
        res.end(pdfBuffer);

        // Close the browser
        await browser.close();
    } catch (error) {
        console.error('Error generating VPN PDF:', error);
        res.status(500).send('Error generating the VPN PDF.');
    }
};


