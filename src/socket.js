import * as io from "socket.io-client";
import {
    onlineUsers,
    userJoined,
    userLeft,
    chatMessage,
    chatMessages,
    notification,
    onlineFriends,
    privateChatMessage
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

        socket.on("notification", notificationMsg => {
            console.log("messages in socket.js");
            store.dispatch(notification(notificationMsg));
        });

        socket.on("onlineFriends", data => {
            store.dispatch(onlineFriends(data));
        });

        socket.on("privateChatMessage", message => {
            console.log("in socket js private chat message:", message);
            store.dispatch(privateChatMessage(message));
        });
    }
    return socket;
}
export function emit(event, data) {
    socket.emit(event, data);
}
