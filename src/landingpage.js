import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
    return (
        <div className="landing">
            <h2 className="landingtxt">
                Lets not be scared to socialize because you have a noisy family
                with kids.
            </h2>
            <h3>Join the like minded people, Lets make family time fun!</h3>

            <Link to="/register">
                <p className="signbtn">Sign up</p>
            </Link>
        </div>
    );
}
