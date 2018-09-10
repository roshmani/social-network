import React, { Component } from "react";
import axios from "./axios";

export default class FriendButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonText: "Add as Friend",
            status: null,
            sender_id: "",
            receiver_id: ""
        };
        this.makeFriendRequest = this.makeFriendRequest.bind(this);
        this.changeButtonText = this.changeButtonText.bind(this);
    }
    componentDidMount() {
        axios
            .get(`/FriendRequestStatus/${this.props.searchedId}`)
            .then(({ data }) => {
                console.log("in mount button", data);
                this.setState(data);
                this.changeButtonText(
                    this.state.sender_id,
                    this.state.receiver_id,
                    this.state.status
                );
            })
            .catch(err => {
                console.log("Error in getting status:", err);
            });
    }
    render() {
        return (
            <div>
                <button
                    onClick={this.makeFriendRequest}
                    className="friendbutton"
                >
                    {this.state.buttonText}
                </button>
            </div>
        );
    }
    makeFriendRequest() {
        axios
            .post(`/addFriend/${this.props.searchedId}`)
            .then(() => {
                this.changeButtonText(
                    this.state.sender_id,
                    this.state.receiver_id,
                    this.state.status
                );
            })
            .catch(err => {
                console.log("Error in inserting into frienships:", err);
            });
    }
    changeButtonText(senderid, receiverid, status) {
        if (status == 1) {
            console.log("in 1");
            if (this.props.searchedId == receiverid) {
                this.setState({ buttonText: "Cancel Request" });
            } else {
                this.setState({ buttonText: "Accept Request" });
            }
        } else if (status == 2) {
            this.setState({ buttonText: "End Friendship" });
        } else {
            this.setState({ buttonText: "Add as Friend" });
        }
    }
}
