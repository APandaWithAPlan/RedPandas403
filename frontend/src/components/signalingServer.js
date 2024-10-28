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
    key: fs.readFileSync('cert.key'),                  // TODO: find the actual file names
    cert: fs.readFileSync('cert.crt')
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
const clientsConnected = [];
//let socketId;

expressServer.listen(port);

// handle connection events
io.on('connection', (socket) => {
    // pull authentication from connectionSetup
    const username = socket.handshake.auth.username;
    const password = socket.handshake.auth.password;

    // password handling
    if (password != "softwaredesign") {
        console.log("Error! Incorrect password!");
        return;
    }

    // track clients
    clientsConnected.push({
        socketId: socket.id,
        username
    })

    // emit any available offers
    if (offers.length){
        socket.emit('availableOffers', offers);
    }

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
        // send the offer out to everyone except offerer
        socket.broadcast.emit('newOfferAwaiting', offers.slice(-1))
    })

    // emit answer from the callee to the original caller
    socket.on('newAnswer', (offerObj, ackFunction) => {
        console.log(offerObj);

        // find the original caller
        const callerClient = clientsConnected.find(client => client.username === offerObj.offererUserName);
        if (!callerClient) {
            console.log("There is no callerClient (signalingServer.js");
        }

        // find the offer that needs to be updated, given new offerObj information
        const offerToUpdate = offers.find(offer=>offer.offererUserName === offerObj.offererUserName);
        if (!offerToUpdate) {
            console.log("There is no offerToUpdate (signalingServer.js)");
            return;
        }

        // write data recieved from offerObj to offerToUpdate array in current file
        ackFunction(offerToUpdate, offererIceCandidates);
        offerToUpdate.answer = offerObj.answer;
        offerToUpdate.offererUserName = username;

        // emit to a room (need the socket ID of the offer in order to send)
        socket.to(callerClient.socketId).emit('answerResponse', offerToUpdate);
    })
    
    // send ice candidates from caller to callee
    socket.on('sendIceCandidateToSignalingServer', (iceCandidateObj) => {
        const amICaller = iceCandidateObj.amICaller;
        const iceUserName = iceCandiateObj.iceUserName;
        const iceCandidate = iceCandidateObj.iceCandidate;

        if (amICaller) {
            // this ice candidate is coming from the offerer. Find the first offererUserName offer
            // in the offers array that is the same as the ice candidate user name we just 
            // received
            const offerInOffers = offers.find(o=>o.offererUserName === iceUserName);

            // if we found the matching offer in the offers array, we're going to put that 
            // callers ice candidates into the package we just found and send it
            if (offerInOffers) {
                offerInOffers.offererIceCandidates.push(iceCandidate)

                if (offerInOffers.answererUserName) {
                    const offerForAnswerer = clientsConnected.find(client => client.username === offerInOffers.answererUserName);

                    if (offerForAnswerer) {
                        socket.to(offerForAnswerer.socketId).emit('receivedIceCandidateFromServer', iceCandidate);
                    } else {
                        console.log("Signaling server received ice candidate, but could not find socketId of answerer.");
                    }
                }
            }
            
        } else {
            // send ice candidate from answerer to offerer. First find the offerer's socket, then
            // look for their username, then look for their socket ID. Add any new info to the package
            const offerInOffers = offers.find(o=>o.answererUserName === iceUserName);
            const offerForCaller = clientsConnected.find(c=>c.username === offerInOffers.offererUserName);

            if (offerForCaller) {
                socket.to(offerForCaller.socketId).emit('receivedIceCandidateFromServer', iceCandidate);
            } else {
                console.log("Signaling server received ice candidate from answerer, could not find offerer.")
            }
        }
    })
})