// Bays
// Red Pandas - 403 
// Desc: Goal is to begin a connection when prompted by a user. First, we need access to each connectees camera and mic

// Constants
let username = null;
let password = null;

const socket = io.connect('https://localhost:3000/', {
    auth: {
        username: "bbays2024",
        password: "softwaredesign"
    }
});

const localVideo = document.querySelector('#local-video');      // local-video and remote-video are variables that represent HTML 
const remoteVideo = document.querySelector('#remote-video');    // element ID's

const stunServers = {
    iceServers: [{
        urls: [
            'stun:stun.l.google.com:19302',
            'stun:stun1.l.google.com:19302'
        ]
    }]
};

let mediaOptions = { audio: true, video: true };

// Variables
let localStream;
let remoteStream;
let peerConnection;
let amICaller = false;

// Get the user media
async function fetchUserMedia(desiredTracks) {
    try {
        console.log('Fetching user media...');
        const stream = await navigator.mediaDevices.getUserMedia(desiredTracks);
        localVideo.srcObject = stream;
        localVideo.muted = true; // Ensures autoplay works without restrictions
        localStream = stream;
        console.log('Local stream acquired');
    } catch (err) {
        console.error('Error accessing media devices:', err);
        throw err;
    }
}

// Check for and display connected devices 
function updateDevices(camerasAvailable, micsAvailable) {
    // Create a dropdown list and options for the cameras 
    const cameraDropdown = document.querySelector('select#cameras');
    cameraDropdown.innerHTML = '';
    
    camerasAvailable.map(camera => {
        const cameraOption = document.createElement('option');
        cameraOption.label = camera.label;
        cameraOption.value = camera.deviceID;
        return cameraOption;
    }).forEach(cameraOption => cameraDropdown.add(cameraOption));

    // Create a dropdown list and options for the mics
    const micDropdown = document.querySelector('select#mics');
    micDropdown.innerHTML = '';

    micsAvailable.map(mic => {
        const micOption = document.createElement('option');
        micOption.label = mic.label;
        micOption.value = mic.deviceID;
        return micOption;
    }).forEach(micOption => micDropdown.add(micOption));
}

// Create a peer connection using STUN servers
async function createPeerConnection(offerObj) {
    console.log('Creating peer connection...');
    return new Promise(async (resolve, reject) => {
        try {
            peerConnection = new RTCPeerConnection(stunServers);
            remoteStream = new MediaStream();
            remoteVideo.srcObject = remoteStream;
            console.log('Peer connection created and remote stream set');

            // Add tracks for the local stream
            for (const track of localStream.getTracks()) {
                peerConnection.addTrack(track, localStream);
                console.log('Local track added:', track);
            }

            // Listen for ice candidates, and if found, send to signaling server
            peerConnection.addEventListener('icecandidate', (event) => {
                if (event.candidate) {
                    console.log('Sending ICE candidate:', event.candidate);
                    socket.emit('sendIceCandidateToSignalingServer', {
                        iceCandidate: event.candidate,
                        iceUserName: username,
                        amICaller
                    });
                }
            });

            // Listen for tracks from other peer
            peerConnection.addEventListener('track', (event) => {
                console.log('Received remote track:', event);
                for (const track of event.streams[0].getTracks()) {
                    remoteStream.addTrack(track);
                    console.log('Remote track added:', track);
                }
            });

            // If this is the answerer accepting the call from the offerer, use the offer object to set the remote description
            if (offerObj) {
                await peerConnection.setRemoteDescription(offerObj.offer);
                console.log('Remote description set for answerer');
            }

            resolve();
        } catch (err) {
            console.error('Error creating peer connection:', err);
            reject(err);
        }
    });
}

// Add answer description to connection object - last step when creating a connection
async function addAnswer(offerObj) {
    try {
        console.log('Adding answer to peer connection...');
        await peerConnection.setRemoteDescription(offerObj.answer);
        console.log('Answer added to peer connection');
    } catch (err) {
        console.error('Error adding answer to peer connection:', err);
    }
}

// INTERACTION FUNCTIONS //

// Initiate a call and send offer to signaling server
async function call() {
    console.log('Starting the call function...');
    await fetchUserMedia(mediaOptions);
    console.log('Local media stream fetched');
    await createPeerConnection();

    try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        amICaller = true;
        console.log('Created and set local offer:', offer);
        socket.emit('newOffer', offer);
        console.log('Offer sent to signaling server');
    } catch (err) {
        console.error('Error during call initiation:', err);
    }
}

// Accept a call
async function answerOffer(offerObj) {
    console.log('Answering the offer...');
    await fetchUserMedia(mediaOptions);
    console.log('Local media stream fetched for answerer');
    await createPeerConnection(offerObj);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    offerObj.answer = answer;
    console.log('Created and set local answer:', answer);

    const offerIceCandidate = await socket.emitWithAck('newAnswer', offerObj);
    console.log('Sent answer to signaling server');

    for (const candidate of offerIceCandidate) {
        await peerConnection.addIceCandidate(candidate);
        console.log('Added ICE candidate:', candidate);
    }
}

// Set up video element attributes for better compatibility
localVideo.setAttribute('autoplay', '');
localVideo.setAttribute('playsinline', '');
remoteVideo.setAttribute('autoplay', '');
remoteVideo.setAttribute('playsinline', '');
