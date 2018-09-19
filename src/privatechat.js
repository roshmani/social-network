import React, { Component } from "react";
import { connect } from "react-redux";
import { emit } from "./socket";
import { Link } from "react-router-dom";

class PrivateChat extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.savechatMessage = this.savechatMessage.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
    }

    savechatMessage(e) {
        if (e.which === 13) {
            emit("privatechat", {
                message: e.target.value,
                receiver_id: this.props.match.params.userId
            });
            e.target.value = "";
        }
    }

    scrollToBottom() {
        this.element.scrollTop =
            this.element.scrollHeight - this.element.clientHeight;
    }

    componentDidUpdate() {
        this.scrollToBottom();
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
                                    <Link to={`/chat/${onlinefriend.id}`}>
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
                <div
                    className="chatMessages"
                    ref={element => (this.element = element)}
                >
                    <fieldset>
                        <legend>Chat Messages</legend>
                        {this.props.messages.map(message => (
                            <div className="chats" key={message.chatid}>
                                <div className="userprof">
                                    <figure>
                                        <img
                                            className="somefriend"
                                            src={message.imageurl}
                                            alt={message.fname}
                                        />
                                        <figcaption>
                                            {message.fname} {message.lname}
                                        </figcaption>
                                    </figure>
                                </div>
                                <div className="chat">
                                    <p>{message.send_at}</p>
                                    <p>{message.message}</p>
                                </div>
                            </div>
                        ))}

                        <textarea
                            className="chatmsg"
                            onKeyDown={this.savechatMessage}
                            placeholder="enter chat"
                        />
                    </fieldset>
                </div>
            </div>
        );
    }
}
const mapChatDatatoProps = state => {
    return {
        onlineFriends:
            state.friends && state.friends.filter(user => user.status == 2),
        messages: state.messages
    };
};

export default connect(mapChatDatatoProps)(PrivateChat);
