
socket.on('newOfferAwaiting', (offers) => {
    console.log("We need Logan to bind this code with an answer caller button");            // INTEGRATE HERE
})

socket.on('answerResponse', offerObj => {
    addAnswer(offerObj);
})