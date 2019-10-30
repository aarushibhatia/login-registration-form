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

		const isRegistered = await checkIfUserExists(connection, jsonReq);
		if (isRegistered) {
			LOG.info("User already exists.");
			connection.destroy();
			return { result: false, message: "Already a user." };
		}

		const isUserAdded = await addUser(connection, jsonReq);
		if (!isUserAdded) {
			LOG.info("User can not be added.");
			connection.destroy();
			return { result: false, message: "User can not be added." };
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

const checkIfUserExists = (connection, jsonReq) => {
	return new Promise((resolve, reject) => {
		try {
			const query = "SELECT EXISTS (SELECT * from users where username = ? and isDeleted = 0) as userExists";
			const queryParams = [jsonReq.username];
			connection.query(query, queryParams, (error, result) => {
				LOG.info(result);
				if (error) {
					LOG.error(error);
					return reject(error);
				}

				if (result[0].userExists > 0) {
					LOG.info(result[0]);
					LOG.info("Username already exists!");
					return resolve(true);
				}

				return resolve(false);
			});
		}
		catch (error) {
			LOG.error(error);
			return reject(error);
		}
	});
};

const addUser = (connection, jsonReq) => {
	return new Promise((resolve, reject) => {
		try {
			const salt = crypto.randomBytes(16).toString('hex');
			const query = "INSERT INTO users (uuid, username, fullName, password, salt, timestamp, isDeleted) VALUES(?, ?, ?, ?, ?, ?, ?)";
			const queryParams = [uuidv4(), jsonReq.username, jsonReq.fullName, sha512(jsonReq.password, salt), salt, new Date().getTime(), 0];

			connection.query(query, queryParams, (error, result) => {
				if (error) {
					LOG.error(error);
					return reject(false);
				}
				else {
					LOG.info(result);
					return resolve(true);
				}
			});
		}
		catch (error) {
			LOG.info(error);
			return reject(error);
		}
	});
};

// Hashing algorithm: SHA512
const sha512 = (password, salt) => crypto.createHmac("sha512", salt).update(password).digest("hex");

const validateRequest = (jsonReq) => (jsonReq && jsonReq.username && jsonReq.password && jsonReq.fullName);





