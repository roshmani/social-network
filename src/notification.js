import React from "react";

export default function Notification(props) {
    return (
        <div className="notification">
            <h3 className="notetxt">{props.notification}</h3>
        </div>
    );
}
