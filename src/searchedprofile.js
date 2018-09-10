import React, { Component } from "react";
import axios from "./axios";
import FriendButton from "./friendbutton";

export default class SearchedProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.fetchData = this.fetchData.bind(this);
    }
    componentDidMount() {
        console.log("in other profile", this.props.match.params.userId);
        this.fetchData(this.props.match.params.userId);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.userId != this.props.match.params.userId) {
            //Fetch user 10 info (the this.props.match.params.id)
            this.fetchData(nextProps.match.params.userId);
        } else {
            this.props.history.push("/");
        }
    }
    fetchData(userId) {
        axios
            .get(`/getSearchedUser/${userId}`)
            .then(({ data }) => {
                console.log("data in searched profile", data);
                this.setState(data);
            })
            .catch(err => {
                console.log("Error in getting searched user Details:", err);
            });
    }
    render() {
        if (!this.state.id) {
            return <div>Loading...</div>;
        }
        const { bio, fname, lname, imageUrl } = this.state;
        return (
            <aside className="Profilediv">
                <div className="profileimgdiv">
                    <img className="profileimage" alt={fname} src={imageUrl} />
                    <h1>
                        {fname} {lname}
                    </h1>
                </div>
                <div className="profilebio">
                    {bio ? (
                        <div className="biodisplaydiv">
                            <p className="displayBio">{bio}</p>
                        </div>
                    ) : (
                        <p>No Bio yet..</p>
                    )}
                </div>
                <FriendButton searchedId={this.props.match.params.userId} />
            </aside>
        );
    }
}
