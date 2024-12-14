// server.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the 'public' directory

// Endpoint to write tasks to the tasks.txt file
app.post('/write-tasks', (req, res) => {
    const tasks = req.body.tasks;

    // Clear tasks.txt file on every request
    fs.writeFileSync('tasks.txt', '', (err) => {
        if (err) {
            console.error('Error clearing file:', err);
        }
    });

    // Write tasks to the tasks.txt file
    let fileContent = '';
    tasks.forEach((task, index) => {
        fileContent += `Task ${index + 1}:\n`;
        fileContent += `Content: ${task.content}\n`;
        fileContent += `Priority: ${task.priority}\n`;
        fileContent += `Time Keyword: ${task.timeKeyword || 'None'}\n`; // Handle time keyword if exists
        fileContent += `Default Assignment: ${task.defaultAssignment || 'Morning'}\n\n`; // Default to Morning
    });

    fs.writeFileSync('tasks.txt', fileContent, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return res.status(500).send('Error writing to file');
        }
    });

    res.send('Tasks written to tasks.txt');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
