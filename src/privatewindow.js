import React, { Component } from "react";
import { connect } from "react-redux";
import { emit } from "./socket";
import { getChatMessages } from "./actions";

class PrivateChatWindow extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.savechatMessage = this.savechatMessage.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(getChatMessages(this.props.match.params.id));
        this.setState({ otherUserId: this.props.match.params.id });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.otherUserId != nextProps.match.params.id) {
            return {
                theId: nextProps.match.params.id
            };
        }
        return null;
    }

    componentDidUpdate() {
        this.scrollToBottom();
        if (this.state.theId) {
            this.props.dispatch(getChatMessages(this.state.theId));
            this.setState({ otherUserId: this.state.theId, theId: null });
        }
    }

    savechatMessage(e) {
        console.log("userid", this.props.match.params.id);
        if (e.which === 13) {
            emit("privateChat", {
                message: e.target.value,
                receiver_id: this.props.match.params.id
            });
            e.target.value = "";
        }
    }

    scrollToBottom() {
        this.element.scrollTop =
            this.element.scrollHeight - this.element.clientHeight;
    }

    render() {
        console.log("in render:", this.props.privateMessages);
        if (!this.props.privateMessages) {
            return null;
        }
        return (
            <div
                className="chatMessages"
                ref={element => (this.element = element)}
            >
                <fieldset>
                    <legend>Chat Messages</legend>
                    {this.props.privateMessages.map(message => (
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
        );
    }
}

const mapPrivateChatMessagestoProps = state => {
    return {
        privateMessages: state.privateMessages
    };
};

export default connect(mapPrivateChatMessagestoProps)(PrivateChatWindow);
