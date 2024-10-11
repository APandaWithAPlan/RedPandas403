#Panda Professor

#Description
A live-streaming web application to match students with a verified tutor.

#Features
- Backend connection framework: the backend features methods from WebRTC to get user media, build media tracks, and initiate a peer to peer connection. These methods work to get the user media (cameras and microphones) of both the callee and the caller. In order to stream data continuously, media tracks are built to carry this data. Once this data is collected, it is sent to a STUN server (as seen in the stunServers variable), which sends back an ICE candidate in response.
