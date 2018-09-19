const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });
const compression = require("compression");
const { hashPass, checkPass } = require("./PwdEncryption");
const {
    regUsers,
    checkEmail,
    getUserDetails,
    updateProfilePic,
    updateUserBio,
    addFriendship,
    getRequestStatus,
    deleteFriendRequest,
    updateFriendshipRequest,
    getFriendsWannabes,
    getUsersByIds,
    getRecentMessages,
    saveChatMsg,
    getPrivateMessages,
    savePrivateChatMsg,
    getFriends
} = require("./socialnetworkdb");
const s3 = require("./s3");
const config = require("./config");
const { secret } = require("./secrets.json");
const csurf = require("csurf");
const cookieSession = require("cookie-session");
app.use(require("cookie-parser")());
/*config:body parser*/
app.use(require("body-parser").json());
const cookieSessionMiddleware = cookieSession({
    secret: secret,
    maxAge: 1000 * 60 * 60 * 24 * 14
});
app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
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
    response.redirect("/welcome");
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
    return getUserInfo(req, res, userId)
        .then(userinfo => {
            res.json(userinfo);
        })
        .catch(function(err) {
            console.log("Error occured in getting user details:", err);
            res.json({});
        });
});
/*******************************************************************************************************/
app.get("/getSearchedUser/:userId", (req, res) => {
    const userId = req.params.userId;
    if (userId == req.session.userId) {
        res.json({ redirect: true });
    } else {
        return getUserInfo(req, res, userId)
            .then(userinfo => {
                res.json(userinfo);
            })
            .catch(function(err) {
                console.log("Error occured in getting user details:", err);
                res.json({});
            });
    }
});
/*******************************************************************************************************/
app.get("/FriendRequestStatus/:searchedId", (req, res) => {
    getRequestStatus(req.session.userId, req.params.searchedId)
        .then(results => {
            if (results.rows.length > 0) {
                res.json({
                    id: results.rows[0].id,
                    sender_id: results.rows[0].sender_id,
                    receiver_id: results.rows[0].receiver_id,
                    status: results.rows[0].status
                });
            } else {
                res.json({ status: null });
            }
        })
        .catch(function(err) {
            console.log("Error occured in getting friendship details:", err);
            res.json({ success: false });
        });
});
/*******************************************************************************************************/
app.get("/getFriendsWannabes", (req, res) => {
    getFriendsWannabes(req.session.userId)
        .then(results => {
            if (results.rows.length > 0) {
                res.json({
                    friends: results.rows
                });
            } else {
                res.json({ status: null });
            }
        })
        .catch(function(err) {
            console.log("Error occured in getting friendship details:", err);
            res.json({ success: false });
        });
});
/*******************************************************************************************************/
app.get("/getPrivateMessages/:receiverid", (req, res) => {
    getPrivateMessages(req.params.receiverid, req.session.userId)
        .then(results => {
            if (results.rows.length > 0) {
                res.json({
                    messages: results.rows
                });
            } else {
                res.json({ messages: null });
            }
        })
        .catch(function(err) {
            console.log("Error occured in getting private chat messages", err);
        });
});

/*******************************************************************************************************/
app.post("/register", (req, res) => {
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
                    hashedpwd,
                    "/profilepic.png"
                );
            })
            .then(function(userid) {
                req.session.userId = userid.rows[0].id;
                res.json({ success: true });
            })
            .catch(function(err) {
                console.log("Error occured in register:", err);
                res.json({ success: false });
            });
    } else {
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
            const { id, sender_id, receiver_id, status } = rows[0];
            res.json({
                id,
                sender_id,
                receiver_id,
                status
            });
        })
        .catch(() => {
            res.status(500).json({
                success: false
            });
        });
});
/*******************************************************************************************************/
app.post("/deleteFriendRequest/:searchedId", (req, res) => {
    deleteFriendRequest(req.session.userId, req.params.searchedId)
        .then(() => {
            res.json({
                success: true
            });
        })
        .catch(err => {
            console.log("Error in deleting Friendship", err);
            res.status(500).json({
                success: false
            });
        });
});
/*******************************************************************************************************/
app.post("/updateFriendRequest/:searchedId", (req, res) => {
    console.log("update friend request", req.params.searchedId);
    updateFriendshipRequest(req.session.userId, req.params.searchedId)
        .then(({ rows }) => {
            const { id, sender_id, receiver_id, status } = rows[0];
            res.json({
                id: id,
                sender_id: sender_id,
                receiver_id: receiver_id,
                status: status
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

            if (results.rows[0].imageurl !== null) {
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

server.listen(8080, function() {
    console.log("I'm listening.");
});

let onlineUsers = {};

io.on("connection", function(socket) {
    console.log(`socket with the id ${socket.id} is now connected`);
    if (!socket.request.session || !socket.request.session.userId) {
        return socket.disconnect(true);
    }
    const socketId = socket.id;
    const userId = socket.request.session.userId;
    onlineUsers[socketId] = userId;

    let arrayOfuserIds = Object.values(onlineUsers);
    getUsersByIds(arrayOfuserIds)
        .then(({ rows }) => {
            socket.emit("onlineUsers", rows);
        })
        .catch(function(err) {
            console.log("Error occured in getting users by ids:", err);
        });

    if (Object.values(onlineUsers).filter(id => id == userId).length == 1) {
        /* or use ---if(arrayOfuserIds.indexOf(userId)==arrayOfuserIds.length - 1){*/
        getUserDetails(userId)
            .then(({ rows }) => {
                socket.broadcast.emit("userJoined", rows[0]);
            })
            .catch(function(err) {
                console.log(
                    "Error occured in getting last joined user details",
                    err
                );
            });
    }

    socket.on("disconnect", () => {
        delete onlineUsers[socket.id];
        //check if the users are in  object.values(userid ) then emit
        if (!Object.values(onlineUsers).includes(userId)) {
            socket.broadcast.emit("userLeft", userId);
        }
    });

    /********************Group Chat***********************************/
    getRecentMessages()
        .then(({ rows }) => {
            socket.emit("chatMessages", rows.reverse());
        })
        .catch(function(err) {
            console.log("Error occured in getting chat messages", err);
        });

    socket.on("chat", message => {
        saveChatMsg(userId, message)
            .then(({ rows }) => {
                let userdet = Object.assign(rows[0]);
                getUserDetails(userId)
                    .then(({ rows }) => {
                        console.log("userdet:", userdet);
                        io.sockets.emit(
                            "chatMessage",
                            Object.assign({}, userdet, rows[0])
                        );
                    })
                    .catch(function(err) {
                        console.log(
                            "Error occured in getting last joined user details",
                            err
                        );
                    });
            })
            .catch(function(err) {
                console.log("Error occured in getting chat message", err);
            });
    });

    /**********************Notification******************************/
    socket.on("notification", data => {
        console.log("receiver_id:", data);
        let receiverSocket = Object.keys(onlineUsers).find(
            key => onlineUsers[key] === data.receiver_id
        );
        console.log("test:", receiverSocket);
        io.sockets.sockets[receiverSocket].emit(
            "notification",
            data.notification
        );
    });
    /*******************Private Chat*******************************/
    getFriends(userId)
        .then(results => {
            if (results.rows.length > 0) {
                socket.emit("onlineFriends", results.rows);
            } else {
                socket.emit("onlineFriends", null);
            }
        })
        .catch(function(err) {
            console.log("Error occured in getting friends details:", err);
        });

    socket.on("privatechat", message => {
        savePrivateChatMsg(userId, message.receiver_id, message)
            .then(({ rows }) => {
                let userdet = Object.assign(rows[0]);
                getUserDetails(userId)
                    .then(({ rows }) => {
                        let receiverSocket = Object.keys(onlineUsers).find(
                            key => onlineUsers[key] === message.receiver_id
                        );
                        console.log("userdet:", userdet);
                        io.sockets.sockets[receiverSocket].emit(
                            "privatechatMessage",
                            Object.assign({}, userdet, rows[0])
                        );
                    })
                    .catch(function(err) {
                        console.log(
                            "Error occured in getting last joined user details",
                            err
                        );
                    });
            })
            .catch(function(err) {
                console.log("Error occured in getting chat message", err);
            });
    });
});
