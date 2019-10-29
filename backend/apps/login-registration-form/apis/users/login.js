const database = require("../../db/db.js");
const crypto = require("crypto");

exports.doService = async jsonReq => {
	let connection;
	try {
		if (!validateRequest(jsonReq)) {
			return { result: false, message: "Insufficient Parameters." };
		}

		connection = database.getConnection();

		const isLoggedIn = await loginUser(connection, jsonReq);
		if (!isLoggedIn) {
			LOG.info("Invalid credentials.");
			connection.destroy();
			return { result: false, message: "Invalid credentials." };
		}

		LOG.info("User logged in.");
		connection.destroy();
		return { result: true, message: "User logged in." };
	}

	catch (error) {
		LOG.error(error);
		connection.destroy();
		return { result: false, message: "500 Internal Server Error" };
	}
}

const loginUser = (connection, jsonReq) => {
	return new Promise((resolve, reject) => {
		connection.query("SELECT salt from users where username = ? and isDeleted = 0", [jsonReq.username], (error, result) => {
			if (error) {
				LOG.error(error);
				return reject(false);
			}
			if (result[0] == undefined) {
				LOG.info("No such user exists.");
				return resolve(false);
			}
			const userSalt = result[0].salt;
			const hashPassword = crypto.pbkdf2Sync(jsonReq.password, userSalt, 1000, 64, 'sha512').toString('hex');
			const sql = "SELECT exists (SELECT * from users where username = ? and password = ? and isDeleted = 0) as validUser"
			connection.query(sql, [jsonReq.username, hashPassword], (error, result) => {
				if (error) {
					LOG.error(error);
					return reject(false);
				}
				if (result[0].validUser > 0) {
					LOG.info("User logged in.");
					return resolve(true);
				}
				LOG.info("Invalid credentials.");
				return resolve(false);
			});
		});
	});
};

const validateRequest = (jsonReq) => (jsonReq && jsonReq.username && jsonReq.password);



