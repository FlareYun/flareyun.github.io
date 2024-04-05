const http = require('http');
const fs = require('fs');
const net = require('node:net');

const proxyPort = process.env.PORT || 3000;;

const server = http.createServer((req, res) => {
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

let x=1

server.on('connect', (req, clientSocket, head) => {
    // Connect to an origin server
    console.log('a')
    const serverSocket = net.connect(3000, "localhost", () => {
        console.log('b'+x)
        clientSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                      'Proxy-agent: Node.js-Proxy\r\n' +
                      '\r\n');
                      
        // Handle errors on the client socket
        console.log('c'+x)
        clientSocket.on('error', (err) => {
            // console.error('Client socket error:', err);
            // Close the server socket if the client socket encounters an error
            serverSocket.destroy();
        });

        // Handle errors on the server socket
        console.log('d'+x)
        serverSocket.on('error', (err) => {
            // console.error('Server socket error:', err);
            // Close the client socket if the server socket encounters an error
            clientSocket.destroy();
        });
    

        serverSocket.write(head);
        serverSocket.pipe(clientSocket);
        clientSocket.pipe(serverSocket);
        console.log('e'+x)
    });

    x++;
});


server.listen(proxyPort, () => {
    console.log(`Proxy server listening on port ${proxyPort}`);
});