import React, { Component } from "react";
import { connect } from "react-redux";
import Chat from "./chat";

class OnlineUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        if (!this.props.onlineUsers) {
            return null;
        }
        return (
            <div className="onlinewrapper">
                <div className="onlinefriends">
                    <fieldset>
                        <legend>Online Friends</legend>
                        {this.props.onlineUsers.map(onlineuser => (
                            <div className="onlineuser" key={onlineuser.id}>
                                <figure>
                                    <img
                                        className="somefriend"
                                        src={onlineuser.imageurl}
                                        alt={onlineuser.fname}
                                    />
                                    <figcaption>
                                        {onlineuser.fname} {onlineuser.lname}
                                    </figcaption>
                                </figure>
                            </div>
                        ))}
                    </fieldset>
                </div>
                <Chat />
            </div>
        );
    }
}
const mapOnlineUserstoProps = state => {
    return {
        onlineUsers: state.onlineUsers
    };
};

export default connect(mapOnlineUserstoProps)(OnlineUsers);
