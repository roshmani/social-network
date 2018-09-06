import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.changeFile = this.changeFile.bind(this);
    }

    render() {
        return (
            <div className="uploadprofilepic">
                <div className="upload-btn">
                    <button className="btn">Upload a Profile Picture</button>
                    <input onChange={this.changeFile} type="file" id="myfile" />
                </div>
            </div>
        );
    }
    changeFile(e) {
        this.file = e.target.files[0];
        var file = this.file;
        /*formdata is an api used to upload a file*/
        const formData = new FormData();
        formData.append("file", file);
        axios
            .post("/upload", formData)
            .then(({ data }) => {
                this.props.updateImage(data.image);
            })
            .catch(err => {
                console.log("error in upload files", err);
            });
    }
}
