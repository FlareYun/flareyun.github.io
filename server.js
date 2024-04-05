const express = require('express');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.all('*', (req, res) => {
    


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

app.on('connect', (req, clientSocket, head) => {
    // Connect to an origin server
    const serverSocket = net.connect(port, () => {
      clientSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                      'Proxy-agent: Node.js-Proxy\r\n' +
                      '\r\n');
      serverSocket.write(head);
      serverSocket.pipe(clientSocket);
      clientSocket.pipe(serverSocket);
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});