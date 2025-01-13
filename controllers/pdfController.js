// const PDFDocument = require('pdfkit');
// const fs = require('fs');
// const path = require('path');

// exports.generatePdf = (req, res) => {
//     const formData = req.body; // Extract form data

//     const doc = new PDFDocument();
//     const filePath = path.join(__dirname, '../output', `${formData.appName}_form.pdf`);
//     const stream = fs.createWriteStream(filePath);

//     doc.pipe(stream);

//     // Add content to the PDF
//     doc.fontSize(16).text('Application Form', { align: 'center' });
//     doc.moveDown();

//     Object.keys(formData).forEach(key => {
//         doc.fontSize(12).text(`${key}: ${formData[key]}`);
//     });

//     doc.end();

//     stream.on('finish', () => {
//         res.download(filePath, `${formData.appName}_form.pdf`, err => {
//             if (err) {
//                 console.error('Error during file download:', err);
//                 res.status(500).send('Error generating PDF');
//             }
//             fs.unlinkSync(filePath); // Clean up file after download
//         });
//     });
// };
                  
                     




                      
         
             
const PDFDocument = require('pdfkit');
const connection = require('../config/db');

exports.generatePdfFromUuid = (uuid, res) => {
    // Create a new PDF document
    const doc = new PDFDocument();

    // Write the PDF to a response stream
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=form_${uuid}.pdf`);

    doc.pipe(res);  // Pipe the PDF to the response

    // Query to fetch the form data using the uuid
    connection.query(
        `SELECT * FROM hosting_details WHERE uuid = ?`, [uuid], 
        (err, hostingResults) => {
            if (err || hostingResults.length === 0) {
                console.error('Error fetching hosting details:', err);
                return res.status(500).send('Error fetching form data.');
            }

            const hostingDetails = hostingResults[0];

            // Fetch department details
            connection.query(
                `SELECT * FROM department_details WHERE uuid = ?`, [uuid], 
                (err, departmentResults) => {
                    if (err || departmentResults.length === 0) {
                        console.error('Error fetching department details:', err);
                        return res.status(500).send('Error fetching form data.');
                    }

                    const departmentDetails = departmentResults[0];

                    // Fetch contact info
                    connection.query(
                        `SELECT * FROM contact_details WHERE uuid = ?`, [uuid], 
                        (err, contactResults) => {
                            if (err) {
                                console.error('Error fetching contact details:', err);
                                return res.status(500).send('Error fetching form data.');
                            }

                            // Fetch vm info
                            connection.query(
                                `SELECT * FROM vm_details WHERE uuid = ?`, [uuid],
                                (err, vmResults) => {
                                    if (err) {
                                        console.error('Error fetching VM details:', err);
                                        return res.status(500).send('Error fetching form data.');
                                    }

                                    const vmDetails = vmResults;

                                    // Add Hosting Details
                                    doc.fontSize(16).text('Application Form', { align: 'center' });
                                    doc.moveDown();
                                    doc.fontSize(12).text(`Deployment Type: ${hostingDetails.deploymentType}`);
                                    doc.text(`App Name: ${hostingDetails.appName}`);
                                    doc.text(`App Details: ${hostingDetails.appDetails}`);
                                    doc.text(`Languages Used: ${hostingDetails.langUsed}`);
                                    doc.text(`DB Used: ${hostingDetails.dbUsed}`);
                                    doc.text(`Framework Used: ${hostingDetails.frameworkUsed}`);
                                    doc.text(`App Type: ${hostingDetails.appType}`);
                                    doc.moveDown();

                                    // Add Department Details
                                    doc.text(`Department Name: ${departmentDetails.deptName}`);
                                    doc.text(`Department Email: ${departmentDetails.deptEmail}`);
                                    doc.text(`Department Phone: ${departmentDetails.deptPhNum}`);
                                    doc.text(`Department Address: ${departmentDetails.deptAddrs}`);
                                    doc.moveDown();

                                    // Add Contact Info
                                    contactResults.forEach(contact => {
                                        doc.text(`Contact Name: ${contact.contactName}`);
                                        doc.text(`Email: ${contact.contactEmail}`);
                                        doc.text(`Phone: ${contact.contactPhNum}`);
                                        doc.text(`Designation: ${contact.contactDesignation}`);
                                        doc.text(`Role: ${contact.contactRole}`);
                                        doc.moveDown();
                                    });

                                    // Add VM Details
                                    doc.text('VM Details:', { underline: true });
                                    vmDetails.forEach(vm => {
                                        doc.text(`VM Name: ${vm.vmName}`);
                                        doc.text(`VM Type: ${vm.vmType}`);
                                        doc.text(`Cores Count: ${vm.coresCount}`);
                                        doc.text(`Services Versions: ${vm.servicesVersions}`);
                                        doc.text(`OS Version: ${vm.osVersion}`);
                                        doc.text(`Storage: ${vm.storage}`);
                                        doc.moveDown();
                                    });

                                    // Finalize the PDF document
                                    doc.end();
                                }
                            );
                        }
                    );
                }
            );
        }
    );
};


