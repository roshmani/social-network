import React, { Component } from "react";
import { connect } from "react-redux";

class OnlineUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {}
    render() {
        if (!this.props.onlineUsers) {
            return null;
        }
        return (
            <div className="onlinefriends">
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
