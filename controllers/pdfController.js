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
                  
                     

                      
         
             
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

// Directory where the PDF will be saved
const outputDir = path.join(__dirname, '../output');

// Check if the output directory exists, if not, create it
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true }); // Create directory if it doesn't exist
}

exports.generatePdf = (req, res) => {
    const formData = req.body; // Extract form data

    const doc = new PDFDocument();
    const filePath = path.join(outputDir, `${formData.appName}_form.pdf`);
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    // Add content to the PDF
    doc.fontSize(16).text('Application Form', { align: 'center' });
    doc.moveDown();

    Object.keys(formData).forEach(key => {
        doc.fontSize(12).text(`${key}: ${formData[key]}`);
    });

    doc.end();

    stream.on('finish', () => {
        res.download(filePath, `${formData.appName}_form.pdf`, err => {
            if (err) {
                console.error('Error during file download:', err);
                return res.status(500).send('Error generating PDF');
            }
            // Clean up file after download
            fs.unlinkSync(filePath);
        });
    });

    stream.on('error', err => {
        console.error('Stream error:', err);
        if (!res.headersSent) {
            res.status(500).send('Error generating PDF');
        }
    });
};

