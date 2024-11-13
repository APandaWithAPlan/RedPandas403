const clientSocketListeners = (socket, typeOfCall, callStatus, updateCallStatus,peerConnection)=>{
    socket.on('answerResponse',entireOfferObj=>{
        console.log(entireOfferObj);
        const copyCallStatus = {...callStatus}
        copyCallStatus.answer = entireOfferObj.answer
        copyCallStatus.myRole = typeOfCall
        updateCallStatus(copyCallStatus)
    })

    // we got an ice candidate, let's add it to peerConnection
    socket.on('receivedIceCandidateFromServer',iceC=>{
        if(iceC){
            peerConnection.addIceCandidate(iceC).catch(err=>{
                console.log("Chrome thinks there is an error. There isn't...")
            })
            console.log(iceC)
            console.log("Added an iceCandidate to existing page presence")
            // setShowCallInfo(false);
        }
    })
}

export { clientSocketListeners };

/*
This code was transferred directly into Call.js

socket.on('newOfferAwaiting', (offers) => {
    console.log("We need Logan to bind this code with an answer caller button");           // INTEGRATE HERE
    // call answer button function
})

socket.on('availableOffers', offers => {
    console.log(offers)
    // call answer button function
})

socket.on('answerResponse', offerObj => {
    addAnswer(offerObj);
})

// create an answer button for EVERY offer that comes in
    // can call offerer user name for answer button
    // make sure to cue answerOffer when the event handler detects a click
*/
