import React, { Component } from "react";
import { connect } from "react-redux";
import { getFriendsWannabes, acceptFriendRequests, unfriend } from "./actions";

class Friends extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            fname: "",
            lname: "",
            imageurl: "",
            buttonText: "",
            status: null,
            sender_id: "",
            receiver_id: ""
        };
    }
    componentDidMount() {
        this.props.dispatch(getFriendsWannabes());
    }
    render() {
        if (!this.props.friends) {
            return null;
        }

        return (
            <div>
                <div>
                    {this.props.friends.map(friend => (
                        <div key={friend.id}>
                            {friend.fname} {friend.lname}
                            <button
                                onClick={e => {
                                    this.props.dispatch(unfriend(friend.id));
                                }}
                            >
                                End Friendship
                            </button>
                        </div>
                    ))}
                </div>
                <div>
                    {this.props.pendingFriends.map(pendingfriend => (
                        <div key={pendingfriend.id}>
                            {pendingfriend.fname} {pendingfriend.lname}
                            <button
                                onClick={e => {
                                    this.props.dispatch(
                                        acceptFriendRequests(pendingfriend.id)
                                    );
                                }}
                            >
                                Accept Friendship
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    console.log("state in map function", state.friends);
    return {
        friends:
            state.friends && state.friends.filter(user => user.status == 2),
        pendingFriends:
            state.friends && state.friends.filter(user => user.status == 1)
    };
};

export default connect(mapStateToProps)(Friends);
