import axios from "./axios";
export function getFriendsWannabes() {
    return axios.get("/getFriendsWannabes").then(resp => {
        return {
            type: "GET_FRIENDS_WANNABES",
            friends: resp.data.friends
        };
    });
}

export function acceptFriendRequests(id) {
    return axios.post("/updateFriendRequest/" + id).then(resp => {
        return {
            type: "ACCEPT_FRIEND_REQUEST",
            id
        };
    });
}

export function unfriend(id) {
    return axios.post("/deleteFriendRequest/" + id).then(resp => {
        return {
            type: "UNFRIEND",
            id
        };
    });
}
export function onlineUsers(onlineUsers) {
    return {
        type: "ONLINE_USERS",
        onlineUsers
    };
}
export function userJoined(joinedUser) {
    return {
        type: "USER_JOINED",
        joinedUser
    };
}

export function userLeft(leftUserId) {
    return {
        type: "USER_LEFT",
        leftUserId
    };
}

export function chatMessages(messages) {
    return {
        type: "CHAT_MESSAGES",
        messages
    };
}

export function chatMessage(message) {
    return {
        type: "CHAT_MESSAGE",
        message
    };
}

export function notification(notification) {
    return {
        type: "NOTIFICATION",
        notification
    };
}

export function closeNotification() {
    return {
        type: "CLOSE_NOTIFICATION",
        notification: null
    };
}

export function onlineFriends(onlineFriends) {
    return {
        type: "ONLINE_FRIENDS",
        onlineFriends
    };
}

export function getChatMessages(receiverid) {
    return axios.get(`/getPrivateMessages/${receiverid}`).then(({ data }) => {
        return {
            type: "PRIVATECHAT_MESSAGES",
            privateMessages: data.privateMessages || []
        };
    });
}

export function privateChatMessage(privateMessage) {
    return {
        type: "PRIVATECHAT_MESSAGE",
        privateMessage
    };
}
