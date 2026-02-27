const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const connection = require('../config/db');
const imageToBase64 = require('image-to-base64');


/* Safe DB Query */
async function queryDatabase(query, params = []) {
    const [rows] = await connection.query(query, params);
    return rows;
}


/* Generate Decommission PDF */
async function generateDecomPdfFromUuid(req, res) {

    const { uuid } = req.params;

    try {

        if (!uuid) {
            return res.status(400).send("Invalid UUID");
        }

        console.log("📄 Generating Decommission PDF:", uuid);

        /* Fetch request data */
        const results = await queryDatabase(
            `SELECT * FROM decom_requests WHERE uuid = ?`,
            [uuid]
        );

        if (results.length === 0) {
            return res.status(404).send("Record not found");
        }

        const data = results[0];

        /* Convert logos */
        const cdacLogoBase64 =
            await imageToBase64(
                path.resolve(__dirname, '../public/pics/cdac-logo.png')
            );

        const sdcLogoBase64 =
            await imageToBase64(
                path.resolve(__dirname, '../public/pics/logo.png')
            );


        /* Build HTML */
        const htmlContent = `
<html>
<head>
<style>
body { font-family: Arial; margin:20px; }
h2 { text-align:center; }
.section { margin-bottom:30px; }
table { width:100%; border-collapse:collapse; }
td, th { border:1px solid #ccc; padding:8px; }
th { background:#f2f2f2; }
</style>
</head>

<body>

<h2>VM Change Request</h2>

<div class="section">
<h3>Department Details</h3>
<table>
<tr><td>Department</td><td>${data.department}</td></tr>
<tr><td>Address</td><td>${data.address}</td></tr>
<tr><td>Administrative Head</td><td>${data.admin_head}</td></tr>
<tr><td>Reason</td><td>${data.reason || 'N/A'}</td></tr>
<tr><td>Action</td><td>${data.action}</td></tr>
</table>
</div>

<div class="section">
<h3>VM Details</h3>
<table>

<tr><th>Type</th><th>Details</th></tr>

<tr>
<td>Decommission</td>
<td>
VM: ${data.vm_name_decom || 'N/A'} <br>
Private IP: ${data.private_ip_decom || 'N/A'} <br>
Public IP: ${data.public_ip_decom || 'N/A'}
</td>
</tr>

<tr>
<td>Increase</td>
<td>
VM: ${data.vm_name_increase || 'N/A'} <br>
vCPU: ${data.vcpus_increase || 'N/A'} <br>
RAM: ${data.ram_increase || 'N/A'} <br>
Storage: ${data.storage_increase || 'N/A'}
</td>
</tr>

<tr>
<td>Decrease</td>
<td>
VM: ${data.vm_name_decrease || 'N/A'} <br>
vCPU: ${data.vcpus_decrease || 'N/A'} <br>
RAM: ${data.ram_decrease || 'N/A'} <br>
Storage: ${data.storage_decrease || 'N/A'}
</td>
</tr>

</table>
</div>

</body>
</html>
`;


        /* Launch Puppeteer */
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        await page.setContent(htmlContent, {
            waitUntil: 'networkidle0'
        });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            displayHeaderFooter: true,

            headerTemplate: `
<div style="width:100%;display:flex;justify-content:space-between;padding:0 40px;">
<img src="data:image/png;base64,${cdacLogoBase64}" height="40"/>
<img src="data:image/png;base64,${sdcLogoBase64}" height="40"/>
</div>`,

            footerTemplate: `
<div style="font-size:10px;width:100%;padding:0 40px;
display:flex;justify-content:space-between;">
<div>© C-DAC Thiruvananthapuram</div>
<div>Page <span class="pageNumber"></span> /
<span class="totalPages"></span></div>
</div>`,

            margin: {
                top: '70px',
                bottom: '50px',
                left: '40px',
                right: '30px'
            }
        });

        await browser.close();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline');
        res.end(pdfBuffer);

        console.log("✅ Decommission PDF generated");

    } catch (err) {
        console.error("PDF ERROR:", err);
        res.status(500).send("PDF generation failed");
    }
};

module.exports = {
    generateDecomPdfFromUuid
};

