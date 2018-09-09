import React from "react";
import Logo from "./logo";
import { Link } from "react-router-dom";

export default function Navigation(props) {
    return (
        <header className="main-header">
            <Logo />
            <div className="nav">
                <ul className="navbar">
                    <li>
                        <Link to="/welcome">Home</Link>
                    </li>
                    {props.logged ? (
                        <li>
                            <Link to="/logout">Logout</Link>
                        </li>
                    ) : (
                        <span>
                            <li>
                                <Link to="/">Register</Link>
                            </li>
                            <li>
                                <Link to="/login">Log In</Link>
                            </li>
                        </span>
                    )}
                </ul>
            </div>
        </header>
    );
}
