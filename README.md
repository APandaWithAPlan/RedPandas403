# Panda Professor

# Description
A live-streaming web application to match students with a verified tutor.

# Features
- Backend connection framework: the backend features methods from WebRTC to get user media, build media tracks, and initiate a peer to peer connection. These methods work to get the user media (cameras and microphones) of both the callee and the caller. In order to stream data continuously, media tracks are built to carry this data. Once this data is collected, it is sent to a STUN server (as seen in the stunServers variable), which sends back an ICE candidate in response.

- Frontend React pages: The frontend serves the javascript pages homepage, signup, and login at the /, /signup, /login, directories respectively. The frontend utilizes react-router-dom to route the pages for the current build. The homepage has a navbar with the Panda Professor name and link buttons for login and register. The homepage also includes a get started message and link button to the signup page. The /signup and /login pages both have fields for new or exisitng credentials as well as links to the opposite page.
