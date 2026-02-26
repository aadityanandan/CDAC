const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const connection = require('../config/db');
const imageToBase64 = require('image-to-base64');

// Helper for DB queries
function queryDatabase(query, params) {
    return new Promise((resolve, reject) => {
        connection.query(query, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
}

exports.generateFirewallPdfFromUuid = async (req, res) => {
    const { uuid } = req.params;

    try {
        // Validate UUID
        if (!uuid || typeof uuid !== 'string') {
            console.error('Invalid UUID:', uuid);
            return res.status(400).send('Invalid UUID provided.');
        }

        console.log('Generating Firewall PDF for UUID:', uuid); // Debug log

        // Fetch firewall data
        const firewallResults = await queryDatabase(
            `SELECT * FROM firewall_details WHERE uuid = ?`,
            [uuid]
        );

        if (firewallResults.length === 0) {
            return res.status(404).send('Firewall request not found.');
        }

        const firewall = firewallResults[0];

        // Convert comma-separated fields into arrays
        const fromArr = typeof firewall.from === 'string' ? firewall.from.split(',') : [];
        const toArr = typeof firewall.to === 'string' ? firewall.to.split(',') : [];
        const portArr = typeof firewall.portNum === 'string' ? firewall.portNum.split(',') : [];
        const serviceArr = typeof firewall.serviceReq === 'string' ? firewall.serviceReq.split(',') : [];
        const reqDetailsArr = typeof firewall.reqDetails === 'string' ? firewall.reqDetails.split(',') : [];


        // Load static content
        const staticPagePath = path.join(__dirname, '../views/dashboard/firewalltac.html');
        const staticContent = fs.readFileSync(staticPagePath, 'utf8');

        // Convert images to base64
        const cdacLogoBase64 = await imageToBase64(path.resolve(__dirname, '../public/pics/cdac-logo.png'));
        const jakegaLogoBase64 = await imageToBase64(path.resolve(__dirname, '../public/pics/logo.png'));

        // Build HTML content
        const htmlContent = `
<html>
<head>
    <title>Firewall Request</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.5; }
        h2 { text-align: center; margin-bottom: 20px; }
        .section { margin-bottom: 40px; }
        .section-title { font-size:20px; font-weight: bold; text-decoration: underline; margin-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; table-layout: auto; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; word-wrap: break-word; white-space: pre-wrap; vertical-align: top; }
        th { background-color: #f4f4f4; }
        img { max-height: 70px; }
    </style>
</head>
<body>
    <h2>Firewall Request Form</h2>

    <!-- General Application Details -->
    <div class="section">
        <div class="section-title">General Application Details</div>
        <table>
            <tr><td style="width:170px">Application Name:</td><td>${firewall.appName}</td></tr>
            <tr><td>URL:</td><td>${firewall.url}</td></tr>
            <tr><td>Private IP Address:</td><td>${firewall.privateIpAddrss}</td></tr>
            <tr><td>Public IP Address:</td><td>${firewall.publicIpAddrss}</td></tr>
        </table>
    </div>

    <!-- Requestor Details -->
    <div class="section">
        <div class="section-title">Requestor Details</div>
        <table>
            <tr><td style="width:170px">Name:</td><td>${firewall.name}</td></tr>
            <tr><td>Email:</td><td>${firewall.email}</td></tr>
            <tr><td>Contact Number:</td><td>${firewall.contactNum}</td></tr>
        </table>
    </div>

    <!-- Firewall Rule Details -->
    <div class="section">
        <div class="section-title">Firewall Rule Details</div>
        <table>
            <tr>
                <th>From</th>
                <th>To</th>
                <th>Port Number</th>
                <th>Service Requested</th>
                <th>Request Details</th>
            </tr>
            ${fromArr.map((_, i) => `
                <tr>
                    <td>${fromArr[i] || 'N/A'}</td>
                    <td>${toArr[i] || 'N/A'}</td>
                    <td>${portArr[i] || 'N/A'}</td>
                    <td>${serviceArr[i] || 'N/A'}</td>
                    <td>${reqDetailsArr[i] || 'N/A'}</td>
                </tr>
            `).join('')}
        </table>
    </div>

    <!-- Terms and Conditions -->
    <div class="section">
        <div class="section-title">Terms and Conditions</div>
        <p>${staticContent}</p>
    </div>
</body>
</html>
`;

        // Puppeteer PDF generation
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

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
                        All rights reserved.
                    </div>
                    <div style="text-align:right;">
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

        // Send response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline');
        res.setHeader('Content-Length', pdfBuffer.length);
        res.end(pdfBuffer);

        await browser.close();
    } catch (error) {
        console.error('Error generating Firewall PDF:', error);
        res.status(500).send('Error generating the Firewall PDF.');
    }
};
