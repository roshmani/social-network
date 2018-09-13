import React from "react";
import Logo from "./logo";
import { Link } from "react-router-dom";

export default function Navigation() {
    return (
        <header className="main-header">
            <Logo />
            <div className="nav">
                <ul className="navbar">
                    <li>
                        <Link to="/logout">Logout</Link>
                    </li>
                    <li>
                        <Link to="/friends">Friends</Link>
                    </li>
                </ul>
            </div>
        </header>
    );
}
