import React, { Component } from "react";

export default class Profile extends Component {
    render() {
        const {
            setBio,
            toggleBio,
            showBio,
            bio,
            fname,
            lname,
            imageUrl,
            clickHandler
        } = this.props;

        return (
            <div className="Profilediv">
                <div className="left">
                    <h1>
                        {fname} {lname}
                    </h1>

                    {bio ? (
                        <div className="biodisplaydiv">
                            <p className="displayBio">{bio}</p>
                            <button onClick={toggleBio}>Edit Bio</button>
                        </div>
                    ) : (
                        <p onClick={toggleBio}>Add a Bio</p>
                    )}

                    {showBio && (
                        <textarea onKeyDown={setBio} defaultValue={bio} />
                    )}
                </div>
                <div className="profileimgdiv">
                    <img
                        className="profileimage"
                        onClick={clickHandler}
                        alt={fname}
                        src={imageUrl}
                    />
                </div>
            </div>
        );
    }
}
