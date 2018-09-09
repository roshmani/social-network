import React from "react";

export default function ProfilePic(props) {
    return (
        <div className="userloggeddiv">
            <div className="imgdiv">
                <img
                    className="profilepic"
                    onClick={props.clickHandler}
                    src={props.imageUrl}
                    alt={props.fname}
                    title="click to add a new profile picture"
                />
                <i className="fas fa-camera" />
            </div>
            <span className="userlogged">
                {props.fname} {props.lname}
            </span>
        </div>
    );
}
