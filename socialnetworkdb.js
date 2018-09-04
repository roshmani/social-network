var spicedpg = require("spiced-pg");
const secrets = require("./secrets.json");
const dbURL = secrets.dbURL;
const db = spicedpg(dbURL);

module.exports.regUsers = function(fname, lname, email, password) {
    var query = `INSERT INTO users(fname,lname,email,password)
	VALUES($1,$2,$3,$4) RETURNING id`;

    return db.query(query, [
        fname || null,
        lname || null,
        email || null,
        password || null
    ]);
};
