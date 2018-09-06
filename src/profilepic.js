import React from "react";

export default function ProfilePic(props) {
    return (
        <div className="imagediv">
            <img
                className="profilepic"
                onClick={props.clickHandler}
                src={props.imageUrl}
                alt={props.fname}
            />
            <h3 className="username">{props.fname}</h3>
        </div>
    );
}
