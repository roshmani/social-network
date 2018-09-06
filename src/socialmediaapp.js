import React from "react";
import axios from "./axios";
import Logo from "./logo";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";

export default class SocialMediaApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.updateImage = this.updateImage.bind(this);
        this.makeUploaderVisible = this.makeUploaderVisible.bind(this);
    }
    componentDidMount() {
        axios.get("/getUserDetails").then(({ data }) => {
            this.setState(data);
        });
    }
    makeUploaderVisible() {
        this.setState({ uploaderIsVisible: true });
    }
    updateImage(imageUrl) {
        this.setState({
            imageUrl: imageUrl,
            uploaderIsVisible: false //makes uploader compent invisible
        });
    }
    render() {
        if (!this.state.id) {
            return null;
            //  or  return <div>Loading...</div>;
        }
        return (
            <div className="mainAppdiv">
                <Logo />
                <ProfilePic
                    imageUrl={this.state.imageUrl}
                    fname={this.state.fname}
                    lname={this.state.fname}
                    clickHandler={this.makeUploaderVisible}
                />
                {this.state.uploaderIsVisible && (
                    <Uploader updateImage={this.updateImage} />
                )}
            </div>
        );
    }
}
