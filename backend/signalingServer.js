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
    key: fs.readFileSync('localhost-key.pem'),                  // TODO: find the actual file names
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

// Packages
const offers = [];
let socketId;

expressServer.listen(port);

// handle connection events
io.on('connection', (socket) => {
    // pull authentication from connectionSetup
    const username = socket.handshake.auth.username;
    const password = socket.handshake.auth.password;

    socketId = socket.id;

    // emit any available offers


    // push any offers to the callee
    socket.on('newOffer', (newOffer) =>{
        offers.push({
            offererUserName: username,
            offer: newOffer,
            offererIceCandidates: [],
            answererUserName: null,
            answer: null,
            answererIceCandidates: []
        })
        socket.broadcast.emit('newOfferAwaiting', offers.slice(-1))
    })

    // emit answer from the callee to the original caller
    socket.on('newAnswer', (offerObj, ackFunction) => {
        console.log(offerObj);

        const offerToUpdate = offers.find(offer=>offer.offererUserName === offerObj.offererUserName);
        if (!offerToUpdate) {
            console.log("There is no offerToUpdate (signalingServer.js)");
            return;
        }

        // write data recieved from offerObj to offerToUpdate array in current file
        ackFunction(offerToUpdate, offererIceCandidates);
        offerToUpdate.answer = offerObj.answer;
        offerToUpdate.offererUserName = username;

        // emit to a room
        socket.to(socketId).emit('answerResponse', offerToUpdate);
    })
    
    // send ice candidates from caller to callee
    socket.on('sendIceCandidateToSignalingServer', (iceCandidateObj) => {
        
    })
})
