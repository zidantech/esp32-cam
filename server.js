const WebSocket = require("ws");
const express = require("express");
const http = require("http");
const fs = require("fs");
const path = require("path");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let latestFrame = null;

wss.on("connection", (ws) => {
    ws.on("message", (data) => {
        latestFrame = data;
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    });
});

app.get("/stream", (req, res) => {
    res.writeHead(200, {
        "Content-Type": "multipart/x-mixed-replace; boundary=frame"
    });

    setInterval(() => {
        if (latestFrame) {
            res.write(`--frame\r\nContent-Type: image/jpeg\r\nContent-Length: ${latestFrame.length}\r\n\r\n`);
            res.write(latestFrame);
            res.write("\r\n");
        }
    }, 33); // ~30 FPS
});

server.listen(3000, () => console.log("Server running on port 3000"));
