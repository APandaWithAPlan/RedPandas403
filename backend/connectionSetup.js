// Bays
// Red Pandas - 403 
// Desc: Goal is to begin a connection when prompted by a user. First, we need access to each connectees camera and mic

// Constants
const localVideo = document.querySelector('#local-video');      // local-video and remote-video are variables that represent HTML 
const remoteVideo = document.querySelector('#remote-video');    // element ID's

const stunServers = {
    serverOptions: [{
        urls: [
            'stun:stun.l.google.com:19302',
            'stun:stun1.l.google.com:19302'
        ]
    }]
}

// Variables
let localStream;

// Get the user media
async function displayUserMedia(constraints) {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        localVideo.srcObject = stream;
        localStream = stream;
        resolve();
    } catch(err) {
        console.log(err);
        reject();
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
async function createPeerConnection() {
    peerConnection = await new RTCPeerConnection(stunServers);
    remoteStream = new MediaStream();
    remoteVideo.srcObject = remoteStream;


}


// Main
function main() {
    try {
        const stream = setupStream({'video':true,'audio':true});
        console.log('Media stream recieved:', stream);
    } catch {
        console.error('An error occurred in setupStream', error);
    }
    
}
