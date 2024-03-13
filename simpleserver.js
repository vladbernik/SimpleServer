const http = require('http');
const fs = require('fs');
const path = require('path');

function logRequest(ip, url, statusCode) {
    const logEntry = `${new Date().toISOString()} | IP: ${ip} | URL: ${url} | Status Code: ${statusCode}\n`;
    fs.appendFile('server.log', logEntry, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });
}

function handleRequest(req, res) {
    const ip = req.connection.remoteAddress;
    const url = req.url === '/' ? '/index.html' : req.url;
    const filePath = path.join(__dirname, url);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            logRequest(ip, url, 404);
        } else {
            res.writeHead(200);
            res.end(data);
            logRequest(ip, url, 200);
        }
    });
}

const server = http.createServer(handleRequest);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
