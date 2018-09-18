import * as io from "socket.io-client";
import {
    onlineUsers,
    userJoined,
    userLeft,
    chatMessage,
    chatMessages
} from "./actions";
let socket;
export function getSocket(store) {
    if (!socket) {
        socket = io.connect();
        socket.on("onlineUsers", data => {
            store.dispatch(onlineUsers(data));
        });

        socket.on("userJoined", data => {
            store.dispatch(userJoined(data));
        });

        socket.on("userLeft", leftUserId => {
            store.dispatch(userLeft(leftUserId));
        });
        socket.on("chatMessage", message => {
            store.dispatch(chatMessage(message));
        });

        socket.on("chatMessages", messages => {
            console.log("messages in socket.js");
            store.dispatch(chatMessages(messages));
        });

        socket.on("notification", messages => {
            console.log("messages in socket.js");
            //store.dispatch(notification(notification));
        });
    }
    return socket;
}
export function emit(event, data) {
    socket.emit(event, data);
}
