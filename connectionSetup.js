// Bays
// Red Pandas - 403 
// Desc: Goal is to begin a connection when prompted by a user. First, we need access to each connectees camera and mic

// Constants
const localVideo = document.querySelector('#local-video');      // local-video and remote-video are variables that represent HTML 
const remoteVideo = document.querySelector('#remote-video');    // element ID's. Need Logan's variables for this

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
let offerStatus = false;

// Get the user media
function displayUserMedia(constraints) {
    return new Promise(async(resolve, reject) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
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
function createPeerConnection() {
    return new Promise(async(resolve, reject) => {
        peerConnection = await new RTCPeerConnection(stunServers);
        remoteStream = new MediaStream();
        remoteVideo.srcObject = remoteStream;

        // build tracks for the local stream
        localStream.getTracks().forEach(track => {
            peerConnection.addTracks(track, localStream);
        })

        // build icecandidate event handling
        peerConnection.addEventListener('icecandidate', event => {
            console.log(event);
            if (event.candidate) {
                
            }
        })

        // listen for tracks from another peer, add them, display their video!
        peerConnection.addEventListener('track', event => {
            console.log(event);
            // get remote track with .stream[0]
            event.stream[0].getTracks().forEach(track => {
                remoteStream.addTracks(track, remoteStream);
            })
        })
    })
}


// Main
async function call() {
    // call user media 
    await displayUserMedia({video: true, audio: true});

    // create peer connection
    await createPeerConnection();

    // create offer object, send to the server

}



//  Documentation:
//      - camerasAvailable is an array of user cameras created after running open media stream
//      - .srcObject: used to assign a video or mic stream to an HTML object
//      - .getTracks(): returns an array of all the media tracks that are currently contained in MediaStream