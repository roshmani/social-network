import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";
import SocialMediaApp from "./socialmediaapp";

let elem;

if (location.pathname == "/welcome") {
    elem = <Welcome />;
} else {
    elem = <SocialMediaApp />;
}

ReactDOM.render(elem, document.querySelector("main"));
