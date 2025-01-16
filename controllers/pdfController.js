// const PDFDocument = require('pdfkit');
// const fs = require('fs');
// const path = require('path'); // Import the path module
// const connection = require('../config/db');

// exports.generatePdfFromUuid = (uuid, res) => {
//     const doc = new PDFDocument();

//     // Write the PDF to a response stream
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename=form_${uuid}.pdf`);

//     doc.pipe(res);  // Pipe the PDF to the response

//     // Path to the static page
//     const staticPagePath = path.join(__dirname, '../views/dashboard/termsandconditions.html');

//     // Query to fetch the form data using the uuid
//     connection.query(
//         `SELECT * FROM hosting_details WHERE uuid = ?`, [uuid],
//         (err, hostingResults) => {
//             if (err || hostingResults.length === 0) {
//                 console.error('Error fetching hosting details:', err);
//                 return res.status(500).send('Error fetching form data.');
//             }

//             const hostingDetails = hostingResults[0];

//             // Fetch department details
//             connection.query(
//                 `SELECT * FROM department_details WHERE uuid = ?`, [uuid],
//                 (err, departmentResults) => {
//                     if (err || departmentResults.length === 0) {
//                         console.error('Error fetching department details:', err);
//                         return res.status(500).send('Error fetching form data.');
//                     }

//                     const departmentDetails = departmentResults[0];

//                     // Fetch contact info
//                     connection.query(
//                         `SELECT * FROM contact_details WHERE uuid = ?`, [uuid],
//                         (err, contactResults) => {
//                             if (err) {
//                                 console.error('Error fetching contact details:', err);
//                                 return res.status(500).send('Error fetching form data.');
//                             }

//                             // Fetch VM info
//                             connection.query(
//                                 `SELECT * FROM vm_details WHERE uuid = ?`, [uuid],
//                                 (err, vmResults) => {
//                                     if (err) {
//                                         console.error('Error fetching VM details:', err);
//                                         return res.status(500).send('Error fetching form data.');
//                                     }

//                                     const vmDetails = vmResults;

//                                     // Add Hosting Details
//                                     doc.fontSize(16).text('Application Form', { align: 'center' });
//                                     doc.moveDown();
//                                     doc.fontSize(12).text(`Deployment Type: ${hostingDetails.deploymentType}`);
//                                     doc.text(`App Name: ${hostingDetails.appName}`);
//                                     doc.text(`App Details: ${hostingDetails.appDetails}`);
//                                     doc.text(`Languages Used: ${hostingDetails.langUsed}`);
//                                     doc.text(`DB Used: ${hostingDetails.dbUsed}`);
//                                     doc.text(`Framework Used: ${hostingDetails.frameworkUsed}`);
//                                     doc.text(`App Type: ${hostingDetails.appType}`);
//                                     doc.moveDown();

//                                     // Add Department Details
//                                     doc.text(`Department Name: ${departmentDetails.deptName}`);
//                                     doc.text(`Department Email: ${departmentDetails.deptEmail}`);
//                                     doc.text(`Department Phone: ${departmentDetails.deptPhNum}`);
//                                     doc.text(`Department Address: ${departmentDetails.deptAddrs}`);
//                                     doc.moveDown();

//                                     // Add Contact Info
//                                     contactResults.forEach(contact => {
//                                         doc.text(`Contact Name: ${contact.contactName}`);
//                                         doc.text(`Email: ${contact.contactEmail}`);
//                                         doc.text(`Phone: ${contact.contactPhNum}`);
//                                         doc.text(`Designation: ${contact.contactDesignation}`);
//                                         doc.text(`Role: ${contact.contactRole}`);
//                                         doc.moveDown();
//                                     });

//                                     // Add VM Details
//                                     doc.text('VM Details:', { underline: true });
//                                     vmDetails.forEach(vm => {
//                                         doc.text(`VM Name: ${vm.vmName}`);
//                                         doc.text(`VM Type: ${vm.vmType}`);
//                                         doc.text(`Cores Count: ${vm.coresCount}`);
//                                         doc.text(`Services Versions: ${vm.servicesVersions}`);
//                                         doc.text(`OS Version: ${vm.osVersion}`);
//                                         doc.text(`Storage: ${vm.storage}`);
//                                         doc.moveDown();
//                                     });

//                                     // Read the static HTML page and add its content
//                                     fs.readFile(staticPagePath, 'utf8', (readErr, staticContent) => {
//                                         if (readErr) {
//                                             console.error('Error reading static page:', readErr);
//                                             return res.status(500).send('Error including static page.');
//                                         }

//                                         // Add a new page and the static content
//                                         doc.addPage().fontSize(14).text('Static Page Content', { underline: true });
//                                         doc.moveDown();
//                                         doc.fontSize(10).text(staticContent);

//                                         // Finalize the PDF document
//                                         doc.end();
//                                     });
//                                 }
//                             );
//                         }
//                     );
//                 }
//             );
//         }
//     );
// };



const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path'); // Import the path module
const connection = require('../config/db');

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

        // Fetching contact and VM details
        const contactResults = await queryDatabase(
            `SELECT * FROM contact_details WHERE uuid = ?`,
            [uuid]
        );
        const vmResults = await queryDatabase(
            `SELECT * FROM vm_details WHERE uuid = ?`,
            [uuid]
        );

        // Reading static content for terms and conditions
        const staticPagePath = path.join(__dirname, '../views/dashboard/termsandconditions.html');
        const staticContent = fs.readFileSync(staticPagePath, 'utf8');

        // Constructing HTML content for the PDF
        const htmlContent = `
            <html>
            <head>
                <title>Application Form</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.5; }
                    h1 { text-align: center; }
                    .section { margin-bottom: 20px; }
                    .section-title { font-weight: bold; text-decoration: underline; margin-bottom: 10px; }
                </style>
            </head>
            <body>
                <h1>Application Form</h1>
                <div class="section">
                    <div class="section-title">Hosting Details</div>
                    <p>Deployment Type: ${hostingDetails.deploymentType}</p>
                    <p>App Name: ${hostingDetails.appName}</p>
                    <p>App Details: ${hostingDetails.appDetails}</p>
                    <p>Languages Used: ${hostingDetails.langUsed}</p>
                    <p>DB Used: ${hostingDetails.dbUsed}</p>
                    <p>Framework Used: ${hostingDetails.frameworkUsed}</p>
                    <p>App Type: ${hostingDetails.appType}</p>
                </div>
                <div class="section">
                    <div class="section-title">Department Details</div>
                    <p>Department Name: ${departmentDetails.deptName}</p>
                    <p>Department Email: ${departmentDetails.deptEmail}</p>
                    <p>Department Phone: ${departmentDetails.deptPhNum}</p>
                    <p>Department Address: ${departmentDetails.deptAddrs}</p>
                </div>
                <div class="section">
                    <div class="section-title">Contact Details</div>
                    ${contactResults.map(contact => `
                        <p>Contact Name: ${contact.contactName}</p>
                        <p>Email: ${contact.contactEmail}</p>
                        <p>Phone: ${contact.contactPhNum}</p>
                        <p>Designation: ${contact.contactDesignation}</p>
                        <p>Role: ${contact.contactRole}</p>
                    `).join('')}
                </div>
                <div class="section">
                    <div class="section-title">VM Details</div>
                    ${vmResults.map(vm => `
                        <p>VM Name: ${vm.vmName}</p>
                        <p>VM Type: ${vm.vmType}</p>
                        <p>Cores Count: ${vm.coresCount}</p>
                        <p>Services Versions: ${vm.servicesVersions}</p>
                        <p>OS Version: ${vm.osVersion}</p>
                        <p>Storage: ${vm.storage}</p>
                    `).join('')}
                </div>
                <div class="section">
                    <div class="section-title">Terms and Conditions</div>
                    ${staticContent}
                </div>
            </body>
            </html>
        `;

        // Using Puppeteer to generate PDF
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'], // Add this for environments like Docker
        });
        const page = await browser.newPage();

        // Setting content and generating the PDF
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true, // Ensures the background colors/images are included
        });

        // Sending the PDF as a response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=form_${uuid}.pdf`);
        res.setHeader('Content-Length', pdfBuffer.length); // Add content length
        res.end(pdfBuffer); // Use res.end() for sending the buffer
        console.log('PDF Buffer Length:', pdfBuffer.length);
        console.log('HTML Content Preview:', htmlContent.substring(0, 500));
        // Closing the browser
        await browser.close();
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating the PDF.');
    }
};

// Helper function to query the database
function queryDatabase(query, params) {
    return new Promise((resolve, reject) => {
        connection.query(query, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
}





