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
})

const localVideo = document.querySelector('#local-video');      // local-video and remote-video are variables that represent HTML 
const remoteVideo = document.querySelector('#remote-video');    // element ID's

const stunServers = {
    serverOptions: [{
        urls: [
            'stun:stun.l.google.com:19302',
            'stun:stun1.l.google.com:19302'
        ]
    }]
};

let mediaOptions = {audio: true, video: true};

// Variables
let localStream;
let remoteStream;
let peerConnection;
let amICaller = false;

// Get the user media
function fetchUserMedia(desiredTracks) {
    return new Promise(async(resolve, reject) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia(desiredTracks);
            localVideo.srcObject = stream;
            localStream = stream;
            resolve();
        } catch(err) {
            console.log(err);
            reject();
        }
    })
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
    }).forEach(cameraOption => cameraDropdown.add(cameraOption));

    // Create a dropdown list and options for the mics
    const micDropdown = document.querySelector('select#mics');
    micDropdown.innerHTML = '';

    micsAvailable.map(mic => {
        const micOption = document.createElement('option');
        micOption.label = mic.label;
        micOption.value = mic.deviceID;
    }).forEach(micOption => micDropdown.add(micOption));
}

// Create a peer connection using STUN servers
async function createPeerConnection(offerObj) {
    // offerObj will not be passed through when a user initiates a call. This variable
    // will only exist after some sort of offer has been created.
    return new Promise(async(resolve, reject) => {
        // setup connection to remote variables
        peerConnection = await new RTCPeerConnection(stunServers);
        remoteStream = new MediaStream();
        remoteVideo.srcObject = remoteStream;

        // add tracks for the local stream
        for (const track of localStream.getTracks()) {
            peerConnection.addTrack(track, localStream);
        }

        // listen for ice candidates, and if found, send to signaling server
        peerConnection.addEventListener('icecandidate', (event) => {
            console.log(event);
            if (event.candidate) {
                socket.emit('sendIceCandidateToSignalingServer', {
                    iceCandidate: event.candidate,
                    iceUserName: username,
                    amICaller
                })
            }
        })

        // listen for tracks from other peer
        peerConnection.addEventListener('track', (event) => {
            console.log(event)
            for (const track of event.streams[0].getTracks()) {
                remoteStream.addTrack(track, remoteStream);
            } 
        })

        // if this is the answerer accepting the call from the offerer, we need to use the offer
        // object to set the remote description of the peer connection
        if (offerObj) {
            peerConnection.setRemoteDescription(offerObj.offer);
        }

        resolve();
    })
}

// add answer description to connection object - last step when creating a connection
async function addAnswer(offerObj) {
    await peerConnection.setRemoteDescription(offerObj.answer);
}

// INTERACTION FUNCTIONS //

// initiate a call and send offer to signaling server
async function call() {
    await fetchUserMedia(mediaOptions);
    await createPeerConnection();
    
    try {
        const offer = await peerConnection.createOffer();
        peerConnection.setLocalDescription(offer);
        amICaller = true;
        socket.emit('newOffer', offer);

    } catch(err) {
        console.log(err)
    }
}

// accept a call
async function answerOffer(offerObj) {
    await fetchUserMedia(mediaOptions);
    await createPeerConnection(offerObj);
    const answer = await peerConnection.createAnswer({});
    await peerConnection.setLocalDescription(answer);

    offerObj.answer = answer;

    const offerIceCandidate = await socket.emitWithAck('newAnswer', offerObj);

    for (const candidate of offerIceCandidate) {
        peerConnection.addIceCandidate(candidate);
    }
}
