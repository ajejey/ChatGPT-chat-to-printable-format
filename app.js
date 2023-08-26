const fs = require('fs');
const PDFDocument = require('pdfkit');

// Load JSON data from the file
const jsonData = require('./jsTeacher.json');

// Create a new PDF document
const doc = new PDFDocument();
const outputPath = 'chatConversation.pdf';

// Pipe the PDF output to a writable stream
const pdfStream = fs.createWriteStream(outputPath);
doc.pipe(pdfStream);

// Define fonts
const regularFont = 'Helvetica';
const codeFont = 'Courier';

// Loop through each conversation item and add to the PDF
for (const messageId in jsonData) {
    const message = jsonData[messageId].message;
    const content = message.content.parts.join('\n');

    // Set the text color and font based on the role (user or assistant)
    const textColor = message.author.role === 'user' ? 'blue' : 'black';
    const font = content.includes('```') ? codeFont : regularFont;

    doc.fillColor(textColor)
        .font(font)
        .text(content, { align: 'left', continued: false });

    doc.moveDown(0.5);
}

// Finalize the PDF and close the stream
doc.end();

pdfStream.on('finish', () => {
    console.log('PDF created successfully.');
});

pdfStream.on('error', (err) => {
    console.error('Error creating PDF:', err);
});
