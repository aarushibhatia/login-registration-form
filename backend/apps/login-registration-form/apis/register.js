const database = require("../db/db.js");
const uuidv4 = require("../3p/node_modules/uuid/v4.js");

exports.doService = async jsonReq => {
	try {
		let confirmation = await populateData(jsonReq.username, jsonReq.fullName, jsonReq.password);
		if (confirmation.result) {
			return { result: true, message: "User registered." };
		}
		else {
			return { result: false, message: "Already a user." };
		}
	}
	catch (error) {
		console.error(error);
	}
}

const populateData = (username, fullName, password) => {
	return new Promise(function (resolve, reject) {
		const sql = "select exists (select * from users where username = ? and isDeleted = 0) as userExists";
		database.connection.query(sql, [username], function (error, result) {
			if (error) {
				LOG.error(error);
				return reject(error);
			}
			else {
				if (result[0].userExists > 0) {
					LOG.info("Username already exists!");
					return resolve({ result: false });
				}
				else {
					LOG.info(uuidv4());
					LOG.info(new Date().getTime());
					LOG.info(new Date().getTime().toString());
					database.connection.query("INSERT INTO users (uuid, username, fullName, password, time, isDeleted) VALUES(? , ?, ? , ?, ? , ?)", [uuidv4(), username, fullName, password, new Date().getTime(), 0], function (error, result) {
						if (error) {
							LOG.error(error);
							return resolve({ result: false });
						}
						else {
							LOG.info("Username added.");
							return resolve({ result: true });
						}
					});
				}
			}
		});
	});
};








