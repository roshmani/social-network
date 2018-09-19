import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PrivateChatWindow from "./privatewindow";
import { BrowserRouter, Route } from "react-router-dom";

class MyFriends extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        if (!this.props.onlineFriends) {
            return null;
        }
        return (
            <div className="onlinewrapper">
                <div className="onlinefriends">
                    <fieldset>
                        <legend>Online Friends</legend>
                        {this.props.onlineFriends.map(onlinefriend => (
                            <div className="onlineuser" key={onlinefriend.id}>
                                <figure>
                                    <Link to={`/myfriends/${onlinefriend.id}`}>
                                        <img
                                            className="somefriend"
                                            src={onlinefriend.imageurl}
                                            alt={onlinefriend.fname}
                                        />
                                    </Link>
                                    <figcaption>
                                        {onlinefriend.fname}{" "}
                                        {onlinefriend.lname}
                                    </figcaption>
                                </figure>
                            </div>
                        ))}
                    </fieldset>
                </div>
                <BrowserRouter>
                    <Route
                        path="/myfriends/:id"
                        component={PrivateChatWindow}
                    />
                </BrowserRouter>
            </div>
        );
    }
}
const mapFriendsDatatoProps = state => {
    return {
        onlineFriends: state.onlineFriends
    };
};

export default connect(mapFriendsDatatoProps)(MyFriends);
