import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
    return (
        <div className="landing">
            <h2 className="landingtxt">
                Lets not be scared to socialize because you have a noisy family
                with multiples troubles...
            </h2>
            <h3>
                Join the like minded people, Lets make time with twinnies fun!
            </h3>

            <Link to="/register">
                <div className="signbtn">Sign up</div>
            </Link>
        </div>
    );
}
