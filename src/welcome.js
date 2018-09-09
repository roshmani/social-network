import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";
import Navigation from "./navigation";

export default function Welcome(props) {
    return (
        <div>
            <div className="welcomediv">
                <img src="Welcomepic.png" alt="welcomepageimg" />
            </div>
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                </div>
            </HashRouter>
        </div>
    );
}
