const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.get('*', (req, res) => {
    
    // Check if the file exists

    console.log("Requested")

    filePath = "noop-1s.mp4"

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // If the file doesn't exist, return a 404 error
            res.status(404).send('File not found');
            return;
        }

        const stat = fs.statSync(path)
        const fileSize = stat.size

        // Set the appropriate content type for an mp4 file
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        }
        
        res.writeHead(200, head)
        
        // Stream the file to the response
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});