// Bays
// Red Pandas - 403 
// Desc: Goal is to begin a connection when prompted by a user. First, we need access to each connectees camera and mic

// IMPORTS
import {io} from 'socket.io-client';


// CONSTANTS
let userName;
let password;

let socket;
const socketConnection = (userName) => {
    if(socket && socket.connected) {
        return socket
    }else {
        socket = io.connect('http://localhost:3000/', {
            auth: {
                userName,
                password: "softwaredesign"
            }
        });
        return socket;
    }
}

//const localVideo = document.querySelector('#local-video');      // local-video and remote-video are variables that represent HTML 
//const remoteVideo = document.querySelector('#remote-video');    // element ID's

let stunServers = {
    iceServers: [{
        urls: [
            'stun:stun.l.google.com:19302',
            'stun:stun1.l.google.com:19302'
        ]
    }]
};


// VARIABLES
//let localStream;
//let remoteStream;
//let peerConnection;
//let amICaller = false;
let mediaOptions = {audio: true, video: true};


// METHODS
// get user media
const fetchUserMedia = (callStatus, updateCallStatus, setLocalStream) => {
    return new Promise(async(resolve, reject) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
            console.log("Obtained user media from fetchUserMedia in connectionSetup.js")
            const copyCallStatus = {...callStatus}
            console.log("CopyCallStatus was initiated")
            copyCallStatus.haveMedia = true //signals to the app that we have media
            console.log("copyCallStatus was set to true")
            copyCallStatus.videoEnabled = null //init both to false, you can init to true
            console.log("Video was set to null")
            copyCallStatus.audioEnabled = false
            console.log("Audio was set to false")
            updateCallStatus(copyCallStatus)
            console.log("Updated call")
            setLocalStream(stream)
            console.log("Set the stream")
            resolve();
        } catch(err) {
            console.log("Did not return promise from fetchUserMedia in connectionSetup.js")
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
const createPeerConnection = (userName, typeOfCall) => {
    const token = 312
    const socket = socketConnection(userName)
    try {
        // setup connection to remote variables
        const peerConnection = new RTCPeerConnection(stunServers);
        const remoteStream = new MediaStream();

        // add tracks for the local stream
        //for (const track of localStream.getTracks()) {
        //    peerConnection.addTrack(track, localStream);
        //}

        // listen for ice candidates, and if found, send to signaling server
        peerConnection.addEventListener('icecandidate', (event) => {
            console.log(event);
            if (event.candidate) {
                socket.emit('sendIceCandidateToSignalingServer', {
                    iceCandidate: event.candidate,
                    iceUserName: userName,
                    amICaller: typeOfCall === "offer"
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
        //if (offerObj) {
        //    peerConnection.setRemoteDescription(offerObj.offer);
        //}

        return ({
            peerConnection,
            remoteStream
        })
    } catch(err) {
        console.log(err)
    }
}

// add answer description to connection object - last step when creating a connection
/*
async function addAnswer(offerObj) {
    await peerConnection.setRemoteDescription(offerObj.answer);
}


// MAIN
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
} */


// EXPORTS
//export {localStream, remoteStream};
export {socket};
export { socketConnection, stunServers, fetchUserMedia };
export { createPeerConnection };

