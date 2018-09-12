import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import axios from "./axios";
import Logo from "./logo";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./Profile";
import SearchedProfile from "./searchedprofile";
import Friends from "./friends";

export default class SocialMediaApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.updateImage = this.updateImage.bind(this);
        this.makeUploaderVisible = this.makeUploaderVisible.bind(this);
        this.makeUploaderInvisible = this.makeUploaderInvisible.bind(this);
        this.toggleBio = this.toggleBio.bind(this);
        this.setBio = this.setBio.bind(this);
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
    render() {
        if (!this.state.id) {
            return <div>Loading...</div>;
        }
        const { fname, lname, imageUrl, bio, showBio } = this.state;
        return (
            <div className="mainAppdiv">
                <div className="headerdiv">
                    <Logo />
                    <ProfilePic
                        imageUrl={imageUrl}
                        fname={fname}
                        lname={lname}
                        clickHandler={this.makeUploaderVisible}
                    />
                </div>
                {this.state.uploaderIsVisible && (
                    <Uploader
                        updateImage={this.updateImage}
                        closeUploader={this.makeUploaderInvisible}
                    />
                )}

                <BrowserRouter>
                    <div>
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
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}
