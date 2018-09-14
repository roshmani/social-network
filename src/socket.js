import * as io from "socket.io-client";
import { onlineUsers } from "./actions";
let socket;
export function getSocket(store) {
    if (!socket) {
        socket = io.connect();
        socket.on("onlineUsers", data => {
            console.log("In online users emit catch event", data);
            store.dispatch(onlineUsers(data));
        });

        /*socket.on("userJoined", data => {
            store.dispatch(userJoined(data));
        });
        socket.on("userLeft", data => {
            store.dispatch(userLeft(data));
        });*/
    }
    return socket;
}
