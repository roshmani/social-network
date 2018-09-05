const express = require("express");
const app = express();
const compression = require("compression");
const { hashPass, checkPass } = require("./PwdEncryption");
const { regUsers, checkEmail } = require("./socialnetworkdb");
const { secret } = require("./secrets.json");
const csurf = require("csurf");
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
app.use(csurf());
app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});
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
        hashPass(req.body.password)
            .then(function(hashedpwd) {
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
/******************************Login*******************************************************/
app.post("/login", (req, res) => {
    let idval;
    if (req.body.emailid && req.body.password) {
        checkEmail(req.body.emailid)
            .then(function(results) {
                if (results.rows.length > 0) {
                    idval = results.rows[0].id;
                    return checkPass(
                        req.body.password,
                        results.rows[0].password
                    );
                } else {
                    throw new Error();
                }
            })
            .then(function(match) {
                if (match) {
                    req.session.userId = idval;
                    res.json({ success: true });
                } else {
                    throw new Error();
                }
            })
            .catch(function(err) {
                console.log("Error occured in login:", err);
                res.json({ success: false });
            });
    } else {
        res.json({ success: false });
    }
});
/***********************************************************************************************************/
app.get("*", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.listen(8080, function() {
    console.log("I'm listening.");
});
