import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Registration from "./registration";
import LandingPage from "./landingpage";
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
                    <div className="componentdiv">
                        <Route exact path="/" component={LandingPage} />
                        <Route
                            exact
                            path="/register"
                            component={Registration}
                        />
                        <Route path="/login" component={Login} />
                    </div>
                </div>
            </div>
        </HashRouter>
    );
}
