A connection originally starts when a user presses the call button in the UI. This call button links to the "call()" function seen in
connectionSetup.js. The call function first calls the "fetchUserMedia()" function. This function uses a promise and WebRTC built in 
functions to ask permission from a user to use their microphone and camera. If the user selects "allow" through the browser, their 
camera media stream is set to the variables localVideo and localStream for further implementation. If the user selects "deny", the 
browser will throw an error. 
Next, the code will call the "createPeerConnection()" function. The first thing this function does is pulls the STUN servers to 
hopefully find some ICE candidates. These ice candidates are a package of information about the current user. It carries all the 
information needed to find the current user, such as IP addresses and possible routes to reach the user successfully. The goal of 
the current user is to send their ice candidate to another user, which the other user can use to find them. The "RTCPeerConnection()" 
function creates these ice candidates after given STUN servers (ie "stunServers" argument). The ice candidate event listener found 
further in connectionSetup.js listens for any ice candidates prepared by "RTCPeerConnection()" and the STUN servers, and forwards them 
to signalingServer.js. 
Next, a media stream is openned for the other user. There will be no video within this media stream until the other user accepts the
call request. The other user's media stream is stored in the variable remoteVideo. Tracks will need to be built for the media streams
to ride on, which means both the caller and the answerer will need tracks for their streams. createPeerConnection() is able to build
those streams for the local user. However, it has to listen for tracks from the remote peer. The track event handler will listen for
tracks sent from the remote user, and if it receives any, it will build the remote tracks on the local side. 
Something to note is that the caller will not pass any argument to the createPeerConnection() function. The offerObj is only passed
when the answerer accepts the call. This will be explained later.
The last step for the caller to initiate a call is to create an offer, using the built in createOffer(). This offer has to be sent to
the other user, but since the current caller doesn't know how to reach the other user yet, the current caller will send the offer
package to the signaling server. To complete the process, the current caller has to set their local description. This is not a key
component of the code, so it will not be explained in this description.

Now, signalingServer.js has received the callers ice candidates and offer. It just needs to send these to the answer. 

signalingServer.js keeps a copy of every offer it receives in a nested list called "offers". Whenever it receives an offer from the
caller, it will copy the information from this offer and put it into its offer list. Once its offer list is thoroughly updated, the
server will send the offer package to the answerer. If a click on the "answer" button is detected, it will trigger the function
"answerOffer(offerObj)" found in connectionSetup.js. The answerer will pass one argument to this function, and it's the offer bundle
it received from the server. 
