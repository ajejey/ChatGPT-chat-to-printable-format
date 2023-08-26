const fs = require('fs');

// Read the JSON file
fs.readFile('jsTeacher.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading JSON file:', err);
        return;
    }

    try {
        const conversation = JSON.parse(data);
        const markdownContent = convertToMarkdown(conversation);

        // Write the markdown content to a file
        fs.writeFile('conversation.md', markdownContent, 'utf8', (writeErr) => {
            if (writeErr) {
                console.error('Error writing markdown file:', writeErr);
                return;
            }
            console.log('Markdown file successfully created: conversation.md');
        });
    } catch (parseErr) {
        console.error('Error parsing JSON:', parseErr);
    }
});

// Function to convert conversation JSON to Markdown
function convertToMarkdown(conversation) {
    let markdownContent = '';

    Object.values(conversation).forEach((message) => {
        const contentParts = message.message.content.parts;
        const content = contentParts.map(part => {
            if (part.startsWith('```')) {
                return part;  // Preserve code block formatting
            }
            return part.replace(/\*\*(.*?)\*\*/g, '**$1**');  // Preserve bold formatting
        }).join('\n');

        const role = message.message.author.role === 'user' ? 'Question' : 'Answer';
        const timestamp = new Date(message.message.create_time * 1000).toLocaleString();

        markdownContent += `## ${role} - \n\n${content}\n\n`;
    });

    return markdownContent;
}
