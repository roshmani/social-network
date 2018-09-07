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

module.exports.checkEmail = function(emailid) {
    var query = `SELECT * FROM users WHERE email=$1`;
    return db.query(query, [emailid]);
};

module.exports.getUserDetails = function(userid) {
    var query = `SELECT * FROM users WHERE id=$1`;
    return db.query(query, [userid]);
};

module.exports.updateProfilePic = function(imgurl, userid) {
    var query = `UPDATE users SET imageurl=$1 WHERE id=$2 RETURNING imageurl`;
    return db.query(query, [imgurl, userid]);
};

module.exports.updateUserBio = function(bio, userid) {
    var query = `UPDATE users SET bio=$1 WHERE id=$2 RETURNING bio`;
    return db.query(query, [bio, userid]);
};
