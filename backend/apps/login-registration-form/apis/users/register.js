const database = require("../../db/db.js");
const uuidv4 = require("../../3p/node_modules/uuid/v4.js");
const crypto = require("crypto");

exports.doService = async jsonReq => {
	let connection;
	try {
		if (!validateRequest(jsonReq)) {
			return { result: false, message: "Insufficient Parameters." };
		}

		connection = database.getConnection();

		const isRegistered = await createUser(connection, jsonReq);
		if (!isRegistered) {
			LOG.info("User could not be registered.");
			connection.destroy();
			return { result: false, message: "Already a user." };
		}

		LOG.info("User registered.");
		connection.destroy();
		return { result: true, message: "User registered." };
	}

	catch (error) {
		LOG.error(error);
		connection.destroy();
		return { result: false, message: "500 Internal server error." };
	}
}

const createUser = (connection, jsonReq) => {
	return new Promise((resolve, reject) => {
		try {
			const salt = crypto.randomBytes(16).toString('hex');
			const sql = "SELECT exists (SELECT * from users where username = ? and isDeleted = 0) as userExists";
			connection.query(sql, [jsonReq.username], (error, result) => {
				if (error) {
					LOG.error(error);
					return reject(false);
				}

				if (result[0].userExists > 0) {
					LOG.info("Username already exists!");
					return resolve(false);
				}

				connection.query("INSERT INTO users (uuid, username, fullName, password, salt, timestamp, isDeleted) VALUES(? , ?, ? , ?, ? , ?, ?)", [uuidv4(), jsonReq.username, jsonReq.fullName, crypto.pbkdf2Sync(jsonReq.password, salt, 1000, 64, 'sha512').toString('hex'), salt, new Date().getTime(), 0], (error, result) => {
					if (error) {
						LOG.error(error);
						return reject(false);
					}
					else {
						LOG.info(result);
						return resolve(true);
					}
				});
			});
		}
		catch (error) {
			LOG.info(error);
			return reject(error);
		}
	});
};

const validateRequest = (jsonReq) => (jsonReq && jsonReq.username && jsonReq.password && jsonReq.fullName);





