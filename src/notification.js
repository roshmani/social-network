import React from "react";

export default function Notification(props) {
    return (
        <div onClick={props.closeNotification} className="notification">
            <h3 className="notetxt">{props.notification}</h3>
        </div>
    );
}
