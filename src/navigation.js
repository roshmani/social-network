import React from "react";
import { Link } from "react-router-dom";

export default function Navigation() {
    return (
        <div className="main-header">
            <div className="nav">
                <ul className="navbar">
                    <li>
                        <Link to="/friends">Friends</Link>
                    </li>
                    <li>
                        <Link to="/onlinefriends">Online Friends</Link>
                    </li>
                    <li>
                        <a href="/logout">Logout</a>
                    </li>
                </ul>
            </div>
        </div>
    );
}
