const express = require("express");
const app = express();
const compression = require("compression");
const { hashPass, checkPass } = require("./PwdEncryption");
const { regUsers } = require("./socialnetworkdb");
const { secret } = require("./secrets.json");
const cookieSession = require("cookie-session");
app.use(require("cookie-parser")());
/*config:body parser*/
app.use(require("body-parser").json());
app.use(
    cookieSession({
        secret: secret,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

/*************************************************************************************************************************/
app.use(compression());

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}
app.use(express.static("public"));

app.get("/Welcome", function(req, res) {
    if (req.session.userId) {
        return res.redirect("/");
    }
    res.sendFile(__dirname + "/index.html");
});

app.post("/register", (req, res) => {
    console.log("body:", req.body);
    if (
        req.body.fname &&
        req.body.lname &&
        req.body.emailid &&
        req.body.password
    ) {
        console.log("in here!");
        hashPass(req.body.password)
            .then(function(hashedpwd) {
                console.log("after hashing in here!", hashedpwd);
                return regUsers(
                    req.body.fname,
                    req.body.lname,
                    req.body.emailid,
                    hashedpwd
                );
            })
            .then(function(userid) {
                console.log("user id:", userid.rows[0].id);
                req.session.userId = userid.rows[0].id;
                res.json({ success: true });
            })
            .catch(function(err) {
                console.log("Error occured in register:", err);
                res.json({ success: false });
            });
    } else {
        console.log("else run");
        res.json({ success: false });
    }
});

app.get("*", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.listen(8080, function() {
    console.log("I'm listening.");
});
