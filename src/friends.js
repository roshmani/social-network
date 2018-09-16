import React, { Component } from "react";
import { connect } from "react-redux";
import { getFriendsWannabes, acceptFriendRequests, unfriend } from "./actions";
import { Link } from "react-router-dom";

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
            <div className="friendsWrapper">
                <div className="friends">
                    <fieldset>
                        <legend>Friends</legend>
                        {this.props.friends.map(friend => (
                            <div className="frienddiv" key={friend.id}>
                                <figure>
                                    <Link to={`/user/${friend.id}`}>
                                        <img
                                            className="somefriend"
                                            src={friend.imageurl}
                                            alt="/profilepic.png"
                                        />
                                    </Link>
                                    <figcaption>
                                        {friend.fname} {friend.lname}
                                    </figcaption>
                                </figure>
                                <button
                                    className="friendbutton"
                                    onClick={() => {
                                        this.props.dispatch(
                                            unfriend(friend.id)
                                        );
                                    }}
                                >
                                    End Friendship
                                </button>
                            </div>
                        ))}
                    </fieldset>
                </div>
                <div className="pendingfriends">
                    <fieldset>
                        <legend>Pending friend requests</legend>
                        {this.props.pendingFriends.map(pendingfriend => (
                            <div
                                className="pendingfrienddiv"
                                key={pendingfriend.id}
                            >
                                <figure>
                                    <Link to={`/user/${pendingfriend.id}`}>
                                        <img
                                            className="somefriend"
                                            src={pendingfriend.imageurl}
                                            alt={pendingfriend.fname}
                                        />
                                    </Link>
                                    <figcaption>
                                        {pendingfriend.fname}{" "}
                                        {pendingfriend.lname}
                                    </figcaption>
                                </figure>

                                <button
                                    className="friendbutton"
                                    onClick={() => {
                                        this.props.dispatch(
                                            acceptFriendRequests(
                                                pendingfriend.id
                                            )
                                        );
                                    }}
                                >
                                    Accept Friendship
                                </button>
                            </div>
                        ))}
                    </fieldset>
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
