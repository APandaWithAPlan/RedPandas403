// Dependencies
const fs = require('fs');
const https = require('https');
const express = require('express');
const socketio = require('socket.io');
const app = express();
const port = 3000;
app.use(express.static(__dirname));

// HTTPS keys needed 
const serverAccess = {
    key: fs.readFileSync('localhost-key.pem'),
    cert: fs.readFileSync('localhost.pem')
};

// Servers
const expressServer = https.createServer(serverAccess, app);
const io = socketio(expressServer, {
        cors : {
            origin: ["https://localhost"],
            methods: ["GET", "POST"]
        }
    }
);

expressServer.listen(port);

// handle connection events
io.on('connection', (socket) => {
    // emit any available offers

    // push any offers to the callee
    socket.on('newOffer', (newOffer) =>{

    })

    // emit answer from the callee to the original caller
    socket.on('newAnswer', (offerObj, ackFunction) => {

    })
    
    // send ice candidates from caller to callee
    socket.on('sendIceCandidateToSignalingServer', (iceCandidateObj) => {
        
    })
})