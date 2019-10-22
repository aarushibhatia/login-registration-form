const database = require("../db/db.js");

exports.doService = async jsonReq => {
	try {
		LOG.info("Got login request for username: " + jsonReq.username);
		let validatedData = await validateData(jsonReq.username, jsonReq.password);
		if (validatedData.result) {
			return { result: true, message: "User logged in." };
		}
		else {
			return { result: false, message: "Invalid credentials." };
		}
	} catch (error) {
		LOG.error(error);
		return { result: false, message: "501 Internal Server Error" };
	}
}

const validateData = (username, password) => {
	return new Promise(function (resolve, reject) {
		const sql = "select exists (select * from users where username = ? and password = ? and isDeleted = 0) as validUser"
		database.connection.query(sql, [username, password], function (error, result) {
			if (error) {
				LOG.error(error);
				return reject(error);
			}
			else {
				if (result[0].validUser > 0) {
					LOG.info("User logged in.");
					return resolve({ result: true, message: "User logged in." });
				}
				else {
					LOG.info("Invalid credentials.");
					return resolve({ result: false, message: "Invalid credentials." });
				}
			}
		});
	});
}



