// var mysql = require('./../../3p/node_modules/mysql');
const bcrypt = require("bcryptjs");

const API_CONSTANTS = require(`./constants.js`);
const database = require('./../../db/db.js');

let usersDB;

exports.getUserHash = data => {
	return new Promise((resolve, reject) => bcrypt.hash(data, API_CONSTANTS.SALT_PW, (err, hash) => {
		if (err) reject("BCRYPT internal error."); else {
			let encoded_hash = encodeURIComponent(hash);

			if (encoded_hash.substr(-1) == '.')
				encoded_hash = encoded_hash.substring(0, encoded_hash.length - 1) + '%2E';
			
			resolve(encoded_hash);		
		}
	}));
}

exports.exists = exports.login = username => {
	return new Promise((resolve, _) => {
		(username => usersDB.all(`SELECT username, password FROM demoApp WHERE username = '${username}' COLLATE NOCASE;`, (err, rows) => {
			if (err || !rows.length) resolve({result: false});
			else resolve({result: true, password: rows[0].password});
		}))
		.catch(_ => resolve({result: false}));
	
});
}
