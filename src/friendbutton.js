import React, { Component } from "react";
import axios from "./axios";

export default class FriendButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonText: "Add as Friend",
            status: null,
            sender_id: "",
            receiver_id: "",
            id: ""
        };
        this.makeFriendRequest = this.makeFriendRequest.bind(this);
        this.changeButtonText = this.changeButtonText.bind(this);
        this.deleteFriendship = this.deleteFriendship.bind(this);
    }
    componentDidMount() {
        axios
            .get(`/FriendRequestStatus/${this.props.searchedId}`)
            .then(({ data }) => {
                console.log("in mount button", data);
                this.setState(data);
                this.changeButtonText();
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
        const { receiver_id, status } = this.state;
        if (!status) {
            axios
                .post(`/addFriend/${this.props.searchedId}`)
                .then(({ data }) => {
                    this.setState(data);
                    this.changeButtonText();
                })
                .catch(err => {
                    console.log("Error in inserting into frienships:", err);
                });
        } else if (status == 1) {
            if (this.props.searchedId == receiver_id) {
                this.deleteFriendship();
            } else {
                console.log("in update:", this.state.id);
                /*axios
                    .post(`/updateFriendRequest/${this.state.Id}`)
                    .then(({ data }) => {
                        this.setState(data);
                        this.changeButtonText();
                    })
                    .catch(err => {
                        console.log("Error in inserting into frienships:", err);
                    });*/
            }
        } else if (status == 2) {
            this.deleteFriendship();
        }
    }
    changeButtonText() {
        const { receiver_id, status } = this.state;
        if (status == 1) {
            if (this.props.searchedId == receiver_id) {
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

    deleteFriendship() {
        axios
            .post(`/deleteFriendRequest/${this.state.Id}`)
            .then(() => {
                this.setState({ status: null });
                this.changeButtonText();
            })
            .catch(err => {
                console.log("Error in inserting into frienships:", err);
            });
    }
}
