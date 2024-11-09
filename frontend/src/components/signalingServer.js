// Dependencies
const fs = require('fs');
const https = require('https');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors'); // Added for CORS handling
const app = express();
const port = 3000;

// Enable CORS for your frontend origin
app.use(cors({
    origin: 'http://localhost:3001', // Replace this with your frontend URL
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.static(__dirname));

// HTTPS keys needed 
const serverAccess = {
    key: fs.readFileSync('cert.key'), // Ensure these files exist and are correct
    cert: fs.readFileSync('cert.crt')
};

// Create HTTPS server and set up Socket.IO
const expressServer = https.createServer(serverAccess, app);
const io = socketio(expressServer, {
    cors: {
        origin: 'http://localhost:3001', // Replace this with your frontend URL
        methods: ['GET', 'POST']
    }
});

// Data structures to manage connected clients and offers
const offers = [];
const queues = {}; // Queue for matching users in the same subject
const clientsConnected = [];

// Start the server and log a message when it is running successfully
expressServer.listen(port, () => {
    console.log(`Signaling server is running on https://localhost:${port}`);
});

// Handle connection events
io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Authenticate user based on connection handshake data
    const username = socket.handshake.auth.username;
    const password = socket.handshake.auth.password;

    console.log(`Attempting authentication for user: ${username}`);

    if (password !== "softwaredesign") {
        console.log(`Authentication failed for user: ${username}`);
        socket.disconnect();
        return;
    }

    console.log(`User authenticated: ${username}`);

    // Track connected clients
    clientsConnected.push({
        socketId: socket.id,
        username
    });
    console.log(`Client added: ${username} with socket ID: ${socket.id}`);

    socket.on('startCall', (subject) => {
        console.log(`User ${username} started a call in ${subject}`);

        if (!queues[subject]) {
            queues[subject] = [];
        }

        queues[subject].push(socket);

        // Check if there is a match in the queue
        if (queues[subject].length >= 2) {
            const [user1, user2] = queues[subject].splice(0, 2);
            console.log(`Matched users: ${user1.id} (${user1.handshake.auth.username}) and ${user2.id} (${user2.handshake.auth.username}) in ${subject}`);

            // Notify users that they are matched
            user1.emit('matchFound', { peerSocketId: user2.id });
            user2.emit('matchFound', { peerSocketId: user1.id });
        } else {
            socket.emit('searchingForMatch', { message: 'Searching for a match...' });
            console.log(`User ${username} is waiting for a match in ${subject}`);
        }
    });

    // Handle 'newOffer' event
    socket.on('newOffer', (newOffer) => {
        console.log(`Received new offer from ${username}`);
        offers.push({
            offererUserName: username,
            offer: newOffer,
            offererIceCandidates: [],
            answererUserName: null,
            answer: null,
            answererIceCandidates: []
        });
        console.log('Broadcasting new offer to other clients');
        socket.broadcast.emit('newOfferAwaiting', offers.slice(-1));
    });

    // Handle 'newAnswer' event
    socket.on('newAnswer', (offerObj, ackFunction) => {
        console.log(`Received new answer from ${username}`);
        console.log(offerObj);

        const callerClient = clientsConnected.find(client => client.username === offerObj.offererUserName);
        if (!callerClient) {
            console.log("No caller client found for the provided username.");
            return;
        }
        console.log(`Caller client found: ${callerClient.username}`);

        const offerToUpdate = offers.find(offer => offer.offererUserName === offerObj.offererUserName);
        if (!offerToUpdate) {
            console.log("No matching offer found to update.");
            return;
        }
        console.log(`Offer found and updated for ${offerObj.offererUserName}`);

        ackFunction(offerToUpdate, offerToUpdate.offererIceCandidates);
        offerToUpdate.answer = offerObj.answer;
        offerToUpdate.answererUserName = username;

        console.log(`Emitting answer response to ${callerClient.socketId}`);
        socket.to(callerClient.socketId).emit('answerResponse', offerToUpdate);
    });

    // Handle 'sendIceCandidateToSignalingServer' event
    socket.on('sendIceCandidateToSignalingServer', (iceCandidateObj) => {
        console.log(`Received ICE candidate from ${username}`);
        const amICaller = iceCandidateObj.amICaller;
        const iceUserName = iceCandidateObj.iceUserName;
        const iceCandidate = iceCandidateObj.iceCandidate;

        if (amICaller) {
            console.log(`Processing ICE candidate from caller: ${iceUserName}`);
            const offerInOffers = offers.find(o => o.offererUserName === iceUserName);

            if (offerInOffers) {
                offerInOffers.offererIceCandidates.push(iceCandidate);
                console.log('Added ICE candidate to caller\'s list');

                if (offerInOffers.answererUserName) {
                    const offerForAnswerer = clientsConnected.find(client => client.username === offerInOffers.answererUserName);

                    if (offerForAnswerer) {
                        console.log(`Sending ICE candidate to answerer: ${offerForAnswerer.username}`);
                        socket.to(offerForAnswerer.socketId).emit('receivedIceCandidateFromServer', iceCandidate);
                    } else {
                        console.log("Could not find socket ID of answerer to send ICE candidate.");
                    }
                }
            }
        } else {
            console.log(`Processing ICE candidate from answerer: ${iceUserName}`);
            const offerInOffers = offers.find(o => o.answererUserName === iceUserName);
            const offerForCaller = clientsConnected.find(c => c.username === offerInOffers?.offererUserName);

            if (offerForCaller) {
                console.log(`Sending ICE candidate to caller: ${offerForCaller.username}`);
                socket.to(offerForCaller.socketId).emit('receivedIceCandidateFromServer', iceCandidate);
            } else {
                console.log("Could not find offerer to send ICE candidate.");
            }
        }
    });

    // Handle client disconnection
    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        const index = clientsConnected.findIndex(client => client.socketId === socket.id);
        if (index !== -1) {
            console.log(`Removing client: ${clientsConnected[index].username}`);
            clientsConnected.splice(index, 1);
        }
    });
});
