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
            <aside className="Profilediv">
                <div className="profileimgdiv">
                    <img
                        className="profileimage"
                        onClick={clickHandler}
                        alt={fname}
                        src={imageUrl}
                    />
                    <h1>
                        {fname} {lname}
                    </h1>
                </div>
                <div className="profilebio">
                    {bio ? (
                        <div className="biodisplaydiv">
                            <p className="displayBio">{bio}</p>
                            <i onClick={toggleBio} className="far fa-edit" />
                        </div>
                    ) : (
                        <p onClick={toggleBio}>Add a Bio</p>
                    )}

                    {showBio && (
                        <textarea
                            className="biotxtarea"
                            onKeyDown={setBio}
                            defaultValue={bio}
                            title="Please write a short bio in 1000 or less words"
                        />
                    )}
                </div>
            </aside>
        );
    }
}
