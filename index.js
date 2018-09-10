const express = require("express");
const app = express();
const compression = require("compression");
const { hashPass, checkPass } = require("./PwdEncryption");
const {
    regUsers,
    checkEmail,
    getUserDetails,
    updateProfilePic,
    updateUserBio,
    addFriendship,
    getRequestStatus
} = require("./socialnetworkdb");
const s3 = require("./s3");
const config = require("./config");
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
/***********************************************************************/
/*                   File Upload header Declarations                   */
/***********************************************************************/
var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");

var diskStorage = multer.diskStorage({
    /*destination: directory to save the files to*/
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});
/****************************************************************************************************************/
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
app.use(express.static("./public"));

app.get("/logout", function(request, response) {
    request.session = null;
    response.redirect("/");
});

app.get("/Welcome", function(req, res) {
    if (req.session.userId) {
        return res.redirect("/");
    }
    res.sendFile(__dirname + "/index.html");
});
/*******************************************************************************************/
/*                                   get user details                                     */
/******************************************************************************************/
app.get("/getUserDetails", (req, res) => {
    const userId = req.session.userId;
    return getUserInfo(req, res, userId).then(userinfo => {
        res.json(userinfo);
    });
});
/*******************************************************************************************************/
app.get("/getSearchedUser/:userId", (req, res) => {
    const userId = req.params.userId;
    return getUserInfo(req, res, userId).then(userinfo => {
        res.json(userinfo);
    });
});
/*******************************************************************************************************/
app.get("/FriendRequestStatus/:searchedId", (req, res) => {
    getRequestStatus(req.session.userId, req.params.searchedId)
        .then(results => {
            res.json({
                sender_id: results.rows[0].sender_id,
                receiver_id: results.rows[0].receiver_id,
                status: results.rows[0].status
            });
        })
        .catch(function(err) {
            console.log("Error occured in getting user details:", err);
            res.json({ success: false });
        });
});
/*******************************************************************************************************/
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
    let idval, fname;
    if (req.body.emailid && req.body.password) {
        checkEmail(req.body.emailid)
            .then(function(results) {
                if (results.rows.length > 0) {
                    idval = results.rows[0].id;
                    fname = results.rows[0].fname;
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
                    res.json({ success: true, username: fname });
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
app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    let userid = req.session.userId;
    updateProfilePic(config.s3Url + req.file.filename, userid)
        .then(({ rows }) => {
            console.log("rows returned", rows[0]);
            res.json({
                image: rows[0].imageurl
            });
        })
        .catch(() => {
            res.status(500).json({
                success: false
            });
        });
});
/********************************************************************************************************/
app.post("/updateBio/:bio", (req, res) => {
    updateUserBio(req.params.bio, req.session.userId)
        .then(({ rows }) => {
            res.json({
                bio: rows[0].bio
            });
        })
        .catch(() => {
            res.status(500).json({
                success: false
            });
        });
});
/*******************************************************************************************************/
app.post("/addFriend/:searchedId", (req, res) => {
    addFriendship(req.session.userId, req.params.searchedId)
        .then(({ rows }) => {
            res.json({
                bio: rows[0].bio
            });
        })
        .catch(() => {
            res.status(500).json({
                success: false
            });
        });
});
/*******************************************************************************************************/
app.get("*", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

function getUserInfo(req, res, userId) {
    return getUserDetails(userId)
        .then(results => {
            let imageurl = "/profilepic.png";
            if (results.rows[0].imageurl != null) {
                imageurl = results.rows[0].imageurl;
            }

            return {
                id: userId,
                fname: results.rows[0].fname,
                lname: results.rows[0].lname,
                imageUrl: imageurl,
                bio: results.rows[0].bio
            };
        })
        .catch(function(err) {
            console.log("Error occured in getting user details:", err);
            res.json({ success: false });
        });
}

app.listen(8080, function() {
    console.log("I'm listening.");
});
