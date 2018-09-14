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
