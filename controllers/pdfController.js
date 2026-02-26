
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const imageToBase64 = require('image-to-base64');
const connection = require('../config/db'); // Make sure this path is correct

// Helper function to query the database
async function queryDatabase(query, params) {
    try {
        const [results] = await connection.execute(query, params);
        return results;
    } catch (err) {
        console.error('[ERROR] Query failed:', err);
        throw err;
    }
}

exports.generatePdfFromUuid = async (uuid, res) => {
    try {
        // Fetch hosting details
        const hostingResults = await queryDatabase(`SELECT * FROM hosting_details WHERE uuid = ?`, [uuid]);
        if (hostingResults.length === 0) return res.status(404).send('Hosting details not found.');
        const hostingDetails = hostingResults[0];

        // Fetch department details
        const departmentResults = await queryDatabase(`SELECT * FROM department_details WHERE uuid = ?`, [uuid]);
        if (departmentResults.length === 0) return res.status(404).send('Department details not found.');
        const departmentDetails = departmentResults[0];

        // Fetch additional info
        const additionalResults = await queryDatabase(`SELECT * FROM additional_info WHERE uuid = ?`, [uuid]);
        if (additionalResults.length === 0) return res.status(404).send('Additional details not found.');
        const additionalDetails = additionalResults[0];

        // Fetch contacts and VM details
        const contactResults = await queryDatabase(`SELECT * FROM contact_details WHERE uuid = ?`, [uuid]);
        const vmResults = await queryDatabase(`SELECT * FROM vm_details WHERE uuid = ?`, [uuid]);

        // Read static terms & conditions
        const staticPagePath = path.join(__dirname, '../views/dashboard/termsandconditions.html');
        const staticContent = fs.readFileSync(staticPagePath, 'utf8');

        // Convert images to base64
        const cdacLogoBase64 = await imageToBase64(path.resolve(__dirname, '../public/pics/cdac-logo.png'));
        const jakegaLogoBase64 = await imageToBase64(path.resolve(__dirname, '../public/pics/logo.png'));

        // Build HTML content
        const htmlContent = `
<html>
<head>
<style>
body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.5; }
h2 { text-align: center; margin-bottom: 20px; }
.section { margin-bottom: 40px; }
.section-title { font-size:20px; font-weight: bold; text-decoration: underline; margin-bottom: 10px; }
table { width: 100%; border-collapse: collapse; margin-bottom: 20px; table-layout: auto; }
th, td { border: 1px solid #ddd; padding: 10px; text-align: left; word-wrap: break-word; word-break: break-word; white-space: pre-wrap; vertical-align: top; }
th { background-color: #f4f4f4; }
img { max-height: 70px; }
li { margin: 10px 0; }
</style>
</head>
<body>
<h2>Application Form</h2>

<!-- Hosting Details -->
<div class="section">
<div class="section-title">Hosting Details</div>
<table>
<tr><td style="width:170px;">Application Name:</td><td>${hostingDetails.appName}</td></tr>
<tr><td>Domain Name:</td><td>${hostingDetails.domainName}</td></tr>
<tr><td>Application Details:</td><td>${hostingDetails.appDetails}</td></tr>
<tr><td>Programming Languages Used:</td><td>${hostingDetails.langUsed}</td></tr>
<tr><td>Database Used:</td><td>${hostingDetails.dbUsed}</td></tr>
<tr><td>Programming Framework Used:</td><td>${hostingDetails.frameworkUsed}</td></tr>
<tr><td>Application Type:</td><td>${hostingDetails.appType}</td></tr>
</table>
</div>

<!-- Department Details -->
<div class="section">
<div class="section-title">Department Details</div>
<table>
<tr><td style="width:170px;">Department Name:</td><td>${departmentDetails.deptName}</td></tr>
<tr><td>Department Email:</td><td>${departmentDetails.deptEmail}</td></tr>
<tr><td>Department Phone:</td><td>${departmentDetails.deptPhNum}</td></tr>
<tr><td>Department Address:</td><td>${departmentDetails.deptAddrs}</td></tr>
</table>
</div>

<!-- Contact Details -->
<div class="section">
<div class="section-title">Contact Details</div>
<table>
<tr><th>Role</th><th>Name</th><th>Email</th><th>Phone</th><th>Designation</th></tr>
${contactResults.map(c => `<tr>
<td>${c.contactRole}</td>
<td>${c.contactName}</td>
<td>${c.contactEmail}</td>
<td>${c.contactPhNum}</td>
<td>${c.contactDesignation}</td>
</tr>`).join('')}
</table>
</div>

<!-- Additional Info -->
<div class="section">
<div class="section-title">Additional Information</div>
<table>
<tr><td style="width:230px;">Total Concurrent Connections:</td><td>${additionalDetails.concurrentUsers}</td></tr>
<tr><td>Peak Month:</td><td>${additionalDetails.peakTime}</td></tr>
<tr><td>Server Load Balancer requirement:</td><td>${additionalDetails.loadBalance}</td></tr>
<tr><td>IPv6 Compatibility :</td><td>${additionalDetails.ipv6Compatibility}</td></tr>
<tr><td>Tape Backup requirement:</td><td>${additionalDetails.tapeBackup}</td></tr>
</table>
</div>

<!-- VM Details -->
<div class="section">
<div class="section-title">VM Details</div>
<table>
<tr><th>Name</th><th>Type</th><th>Cores</th><th>Services</th><th>OS Version</th><th>RAM</th><th>Storage</th><th>Expected Growth</th></tr>
${vmResults.map(vm => `<tr>
<td>${vm.vmName}</td>
<td>${vm.vmType}</td>
<td>${vm.coresCount}</td>
<td>${vm.servicesVersions}</td>
<td>${vm.osVersion}</td>
<td>${vm.ram}</td>
<td>${vm.storage}</td>
<td>${vm.expectedGrowth}</td>
</tr>`).join('')}
</table>
</div>

<!-- Terms -->
<div class="section">
<div class="section-title">Terms and Conditions</div>
<p>${staticContent}</p>
</div>

</body>
</html>
`;

        // Launch Puppeteer
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
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
</div></div>
            `,
            footerTemplate: `
<div style="font-size:10px; color:#555; width:100%; padding:0 50px; display:flex; justify-content:space-between; align-items:center;">
<div>&copy; 2024 Designed and developed by C-DAC Thiruvananthapuram<br>All rights reserved. Version 1.0.0</div>
<div>Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>
</div>
            `,
            margin: { top: '70px', bottom: '50px', right: '30px', left: '40px' }
        });

        // Send PDF inline
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline');
        res.setHeader('Content-Length', pdfBuffer.length);
        res.end(pdfBuffer);

        await browser.close();

    } catch (err) {
        console.error('[ERROR] PDF generation failed:', err);
        res.status(500).send('Error generating PDF.');
    }
};
