import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import axios from "./axios";
import Logo from "./logo";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./Profile";
import SearchedProfile from "./searchedprofile";
import Navigation from "./navigation.js";
import Notification from "./notification.js";
import Friends from "./friends";
import OnlineUsers from "./onlineusers";
import PrivateChat from "./privatechat";
import { connect } from "react-redux";
import { closeNotification } from "./actions.js";

class SocialMediaApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.updateImage = this.updateImage.bind(this);
        this.makeUploaderVisible = this.makeUploaderVisible.bind(this);
        this.makeUploaderInvisible = this.makeUploaderInvisible.bind(this);
        this.toggleBio = this.toggleBio.bind(this);
        this.setBio = this.setBio.bind(this);
        this.closeNotification = this.closeNotification.bind(this);
    }
    componentDidMount() {
        axios.get("/getUserDetails").then(({ data }) => {
            this.setState(data);
            /************* or you can also do this to be explicit  ***************************/
            /*const { id, fname, lname, emailid, bio, imageUrl } = data;
            this.setState({
                id,
                fname,
                lname,
                emailid,
                bio,
                imageUrl: imageurl
            });*/
            /*********************************************************************************/
        });
    }
    makeUploaderVisible() {
        this.setState({ uploaderIsVisible: true });
    }
    makeUploaderInvisible() {
        this.setState({ uploaderIsVisible: false });
    }
    updateImage(imageUrl) {
        this.setState({
            imageUrl: imageUrl,
            uploaderIsVisible: false //makes uploader component invisible
        });
    }
    toggleBio() {
        this.setState({
            showBio: !this.state.showBio
        });
    }

    setBio(e) {
        if (e.which === 13) {
            axios
                .post("/updateBio/" + e.target.value)
                .then(({ data }) => {
                    this.setState({
                        bio: data.bio,
                        showBio: false
                    });
                })
                .catch(err => {
                    console.log("error in upload files", err);
                });
        }
    }

    closeNotification() {
        this.props.dispatch(closeNotification());
    }
    render() {
        if (!this.state.id) {
            return <div>Loading...</div>;
        }
        const { fname, lname, imageUrl, bio, showBio } = this.state;
        return (
            <BrowserRouter>
                <div>
                    {this.props.notification && (
                        <Notification
                            notification={this.props.notification}
                            closeNotification={this.closeNotification}
                        />
                    )}
                    <div className="mainAppdiv">
                        <div className="headerdiv">
                            <Logo />
                            <ProfilePic
                                imageUrl={imageUrl}
                                fname={fname}
                                lname={lname}
                                clickHandler={this.makeUploaderVisible}
                            />
                            <Navigation />
                        </div>
                        {this.state.uploaderIsVisible && (
                            <Uploader
                                updateImage={this.updateImage}
                                closeUploader={this.makeUploaderInvisible}
                            />
                        )}
                        <Route
                            exact
                            path="/"
                            render={() => (
                                <Profile
                                    fname={fname}
                                    lname={lname}
                                    imageUrl={imageUrl}
                                    bio={bio}
                                    toggleBio={this.toggleBio}
                                    setBio={this.setBio}
                                    showBio={showBio}
                                    clickHandler={this.makeUploaderVisible}
                                />
                            )}
                        />
                        <Route
                            exact
                            path="/user/:userId"
                            component={SearchedProfile}
                        />
                        <Route exact path="/friends" component={Friends} />
                        <Route
                            exact
                            path="/onlinefriends"
                            component={OnlineUsers}
                        />
                        <Route
                            exact
                            path="/chat/:userId"
                            component={PrivateChat}
                        />
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}

const mapStateToProps = state => {
    console.log("state in map function", state.notification);
    return {
        notification: state.notification
    };
};

export default connect(mapStateToProps)(SocialMediaApp);
