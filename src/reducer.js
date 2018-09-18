export function reducer(state = {}, action) {
    if (action.type == "GET_FRIENDS_WANNABES") {
        state = Object.assign({}, state, {
            friends: action.friends
        });
    }
    if (action.type == "ACCEPT_FRIEND_REQUEST") {
        /*it goes through the array and add it to a new array with already friends*/
        state = {
            ...state,
            friends: state.friends.map(friend => {
                if (friend.id == action.id) {
                    return { ...friend, status: 2 };
                } else {
                    return friend;
                }
            })
        }; //ES6
    }
    if (action.type == "UNFRIEND") {
        /*it loops through the friends array and filters the deleted friend out of the array based on actions.id*/
        state = {
            ...state,
            friends: state.friends.filter(friend => friend.id != action.id)
        };
    }

    if (action.type == "ONLINE_USERS") {
        state = { ...state, onlineUsers: action.onlineUsers };
    }

    if (action.type == "USER_JOINED") {
        state = {
            ...state,
            onlineUsers: [action.joinedUser, ...state.onlineUsers]
        };
    }
    if (action.type == "USER_LEFT") {
        state = {
            ...state,
            onlineUsers: state.onlineUsers.filter(
                user => user.id != action.leftUserId
            )
        };
    }

    if (action.type == "CHAT_MESSAGES") {
        state = { ...state, messages: action.messages };
    }

    if (action.type == "CHAT_MESSAGE") {
        console.log("in add chat");
        state = { ...state, messages: [...state.messages, action.message] };
    }
    return state;
}
