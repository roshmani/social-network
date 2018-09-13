var spicedpg = require("spiced-pg");
const secrets = require("./secrets.json");
const dbURL = secrets.dbURL;
const db = spicedpg(dbURL);

module.exports.regUsers = function(fname, lname, email, password, imgurl, bio) {
    var query = `INSERT INTO users(fname,lname,email,password,imageUrl,bio)
	VALUES($1,$2,$3,$4,$5,$6) RETURNING id`;

    return db.query(query, [
        fname || null,
        lname || null,
        email || null,
        password || null,
        imgurl || null,
        bio || null
    ]);
};

module.exports.addFriendship = function(senderid, receiverid) {
    var query = `INSERT INTO friendships(sender_id,receiver_id)
	VALUES($1,$2) RETURNING *`;

    return db.query(query, [senderid || null, receiverid || null]);
};

module.exports.checkEmail = function(emailid) {
    var query = `SELECT * FROM users WHERE email=$1`;
    return db.query(query, [emailid]);
};

module.exports.getUserDetails = function(userid) {
    var query = `SELECT * FROM users WHERE id=$1`;
    return db.query(query, [userid]);
};

module.exports.getRequestStatus = function(userid, searchedid) {
    var query = `SELECT id,receiver_id ,sender_id ,status
    FROM friendships
    WHERE (receiver_id=$1 and sender_id=$2)
    OR (receiver_id= $2 and sender_id=$1)`;
    return db.query(query, [userid, searchedid]);
};

module.exports.getFriendsWannabes = function(receiverid) {
    var query = ` SELECT users.id, fname, lname, imageurl, status
    FROM friendships
    JOIN users
    ON (status = 1 AND receiver_id = $1 AND sender_id = users.id)
    OR (status = 2 AND receiver_id = $1 AND sender_id = users.id)
    OR (status = 2 AND sender_id = $1 AND receiver_id = users.id)`;
    return db.query(query, [receiverid]);
};

module.exports.updateProfilePic = function(imgurl, userid) {
    var query = `UPDATE users SET imageurl=$1 WHERE id=$2 RETURNING imageurl`;
    return db.query(query, [imgurl, userid]);
};

module.exports.updateUserBio = function(bio, userid) {
    var query = `UPDATE users SET bio=$1 WHERE id=$2 RETURNING bio`;
    return db.query(query, [bio, userid]);
};

module.exports.updateFriendshipRequest = function(sender_id, receiver_id) {
    console.log("in update friendreq:", sender_id, receiver_id);
    var query = `UPDATE friendships SET status=2
     WHERE (receiver_id=$1 and sender_id=$2)
     OR (receiver_id= $2 and sender_id=$1) RETURNING *`;
    return db.query(query, [sender_id, receiver_id]);
};

module.exports.deleteFriendRequest = function(sender_id, receiver_id) {
    var query = `DELETE from friendships
    WHERE (receiver_id=$1 and sender_id=$2)
    OR (receiver_id= $2 and sender_id=$1)`;
    return db.query(query, [sender_id, receiver_id]);
};
