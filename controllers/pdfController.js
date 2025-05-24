const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path'); // Import the path module
const connection = require('../config/db');
const imageToBase64 = require('image-to-base64');

// Define the queryDatabase function here
function queryDatabase(query, params) {
    return new Promise((resolve, reject) => {
        connection.query(query, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
}

exports.generatePdfFromUuid = async (uuid, res) => {
    try {
                // Fetching hosting details
                const hostingResults = await queryDatabase(
                    `SELECT * FROM hosting_details WHERE uuid = ?`,
                    [uuid]
                );
                if (hostingResults.length === 0) {
                    return res.status(404).send('Hosting details not found.');
                }
                const hostingDetails = hostingResults[0];
        
                // Fetching department details
                const departmentResults = await queryDatabase(
                    `SELECT * FROM department_details WHERE uuid = ?`,
                    [uuid]
                );
                if (departmentResults.length === 0) {
                    return res.status(404).send('Department details not found.');
                }
                const departmentDetails = departmentResults[0];
                
                // Fetching additional info details
                const additionalResults = await queryDatabase(
                    `SELECT * FROM additional_info WHERE uuid = ?` ,
                    [uuid]
                );
                if (additionalResults.length ===0) {
                    return res.status(404).send('Additional details not found.');
                }
                const additionalDetails = additionalResults[0];
                
                // Fetching contact and VM details
                const contactResults = await queryDatabase(
                    `SELECT * FROM contact_details WHERE uuid = ?`,
                    [uuid]
                );
                const vmResults = await queryDatabase(
                    `SELECT * FROM vm_details WHERE uuid = ?`,
                    [uuid]
                );

        // Fetching terms and conditions static content
        const staticPagePath = path.join(__dirname, '../views/dashboard/termsandconditions.html');
        const staticContent = fs.readFileSync(staticPagePath, 'utf8');

        // Convert images to base64 (if required for inline display)
        const cdacLogoBase64 = await imageToBase64(path.resolve(__dirname, '../public/pics/cdac-logo.png'));
        const jakegaLogoBase64 = await imageToBase64(path.resolve(__dirname, '../public/pics/logo.png'));

        // Construct the main content for the PDF
        const htmlContent = `
<html>
<head>
    <title>Hosting Form</title>
    <style>
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
        table-layout: auto; /* Allow columns to auto-adjust */
    }
    th, td { 
        border: 1px solid #ddd; 
        padding: 10px; 
        text-align: left; 
        word-wrap: break-word; /* Break long words */
        word-break: break-word; /* Break long unbroken strings */
        white-space: pre-wrap; /* Preserve spacing and wrap text properly */
        /*font-weight: bold;  Bold content */
        vertical-align: top; /* Align content to the top */
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

    </style>
</head>
<body>
    <h2>Application Form</h2>
        <!-- Hosting Details Section -->
        <div class="section">
            <div class="section-title">Hosting Details</div>
            <table>
                <tr>
                    <td style="width:170px";>Application Name:</td>
                    <td>${hostingDetails.appName}</td>
                </tr>
                <tr>
                    <td>Application Details:</td>
                    <td>${hostingDetails.appDetails}</td>
                </tr>
                <tr>
                    <td>Programming Languages Used:</td>
                    <td>${hostingDetails.langUsed}</td>
                </tr>
                <tr>
                    <td>Database Used:</td>
                    <td>${hostingDetails.dbUsed}</td>
                </tr>
                <tr>
                    <td>Programming Framework Used:</td>
                    <td>${hostingDetails.frameworkUsed}</td>
                </tr>
                <tr>
                    <td>Application Type:</td>
                    <td>${hostingDetails.appType}</td>
                </tr>
            </table>
        </div>

        <!-- Department Details Section -->
        <div class="section">
            <div class="section-title">Department Details</div>
            <table>
                <tr>
                    <td style="width:170px";>Department Name:</td>
                    <td>${departmentDetails.deptName}</td>
                </tr>
                <tr>
                    <td>Department Email:</td>
                    <td>${departmentDetails.deptEmail}</td>
                </tr>
                <tr>
                    <td>Department Phone:</td>
                    <td>${departmentDetails.deptPhNum}</td>
                </tr>
                <tr>
                    <td>Department Address:</td>
                    <td>${departmentDetails.deptAddrs}</td>
                </tr>
            </table>
        </div>

        <!-- Contact Details Section -->
        <div class="section">
            <div class="section-title">Contact Details</div>
            <table>
                <tr>
                    <th>Contact's Role:</th>
                    <th>Contact's Name:</th>
                    <th>Contact's Email:</th>
                    <th>Contact's Phone number:</th>
                    <th>Contact's Designation:</th>
                </tr>
                ${contactResults.map(contact => `
                    <tr> 
                        <td style="width:170px";>${contact.contactRole}</td>
                        <td>${contact.contactName}</td>
                        <td>${contact.contactEmail}</td>
                        <td>${contact.contactPhNum}</td>
                        <td>${contact.contactDesignation}</td>  
                    </tr>
                `).join('')}
            </table>
        </div>
         <br></br>
        <!-- Additional Information Section -->
        <div class="section">
            <div class="section-title">Additional Information</div>
            <table>   
                <tr>
                    <td style="width:230px;">Total Concurrent Connections:</td>
                    <td>${additionalDetails.concurrentUsers}</td>
                </tr>
                <tr>
                    <td>Peak Month of the application:</td>
                    <td>${additionalDetails.peakTime}</td>
                </tr>
                <tr>
                    <td>Server Load Balancer requirement:</td>
                    <td>${additionalDetails.loadBalance}</td>
                </tr>
                <tr>
                    <td>IPv6 Compatibility requirement :</td>
                    <td>${additionalDetails.ipv6Compatibility}</td>
                </tr>
                <tr>
                    <td>Tape Backup requirement:</td>
                    <td>${additionalDetails.tapeBackup}</td>
                </tr>
            </table>
        </div>

        <!-- VM Details Section -->
        <div class="section">
            <div class="section-title">VM Details</div>
            <table>
                <tr>
                    <th>Virtual Machine Name:</th>
                    <th>Virtual Machine Type:</th>
                    <th>Number of Virtual Cores required:</th>
                    <th>Services Versions used:</th>
                    <th>Operating System Version:</th>
                    <th>Storage required:</th>
                </tr>
                ${vmResults.map(vm => `
                    <tr>
                        <td>${vm.vmName}</td>
                        <td>${vm.vmType}</td>
                        <td>${vm.coresCount}</td>
                        <td>${vm.servicesVersions}</td>
                        <td>${vm.osVersion}</td>
                        <td>${vm.storage}</td>
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
            <strong>&copy; 2024 Designed and developed by C-DAC Thiruvananthapuram</strong><br>
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

        // Send the PDF as a response
        // res.setHeader('Content-Type', 'application/pdf');
        // res.setHeader('Content-Disposition', `attachment; filename=form_${uuid}.pdf`);
        // res.setHeader('Content-Length', pdfBuffer.length);
        // res.end(pdfBuffer);

        // Send the PDF as a response (for online viewing)
       res.setHeader('Content-Type', 'application/pdf');
       res.setHeader('Content-Disposition', 'inline'); // View in browser instead of downloading
       res.setHeader('Content-Length', pdfBuffer.length);
       res.end(pdfBuffer);


        // Close the browser
        await browser.close();
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating the PDF.');
    }
};





