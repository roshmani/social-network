import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";
import { Link } from "react-router-dom";

export default function Welcome() {
    return (
        <HashRouter>
            <div className="landingpagediv">
                <div className="logobrand">
                    <h1 className="logotxt">Family Gaggle</h1>
                </div>
                <div className="welcomediv">
                    <div className="signinbtn">
                        <Link to="/login">
                            <p className="signbtn">Sign In</p>
                        </Link>
                    </div>
                    <div className="landing">
                        <h2 className="landingtxt">
                            Lets not be scared to socialize because you have a
                            noisy family with kids..Join the like minded people
                            here
                        </h2>
                        <Link to="/register">
                            <p className="signbtn">Sign up</p>
                        </Link>
                    </div>
                </div>
                <div className="componentdiv">
                    <Route exact path="/register" component={Registration} />
                    <Route path="/login" component={Login} />
                </div>
            </div>
        </HashRouter>
    );
}
