const express = require('express');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.all('*', (req, res) => {
    

    console.log("Requested")

    filePath = "noop-1s.mp4"

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            res.status(404).send('File not found');
            return;
        }

        const stat = fs.statSync(filePath)
        const fileSize = stat.size

        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        }
        
        res.writeHead(200, head)
        
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});