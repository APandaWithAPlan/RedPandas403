import {io} from 'socket.io-client';

let socket;
const socketConnection = username => {
    if (socket && socket.connected) {
        return socket;
    } else {
        socket = io.connect('https://localhost:3000/', {
            auth: {
                username: "bbays2024",
                password: "softwaredesign",
            }
        });
        return socket;
    }
}

export default socketConnection;

