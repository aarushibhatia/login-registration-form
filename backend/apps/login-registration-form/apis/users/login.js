const database = require("../../db/db.js");
const crypto = require("crypto");

exports.doService = async (jsonReq) => {

	// Validate API request and check mandatory payload required
	if (!validateRequest(jsonReq)) return { result: false, message: "Insufficient parameters." };

	let connection;
	try {
		connection = database.getConnection();

		const userDetails = await loginUser(connection, jsonReq);
		if (!userDetails) {
			connection.destroy();
			return { result: false, message: "Invalid credentials." };
		}

		connection.destroy();
		return { result: true, results: { user: userDetails } };
	}

	catch (error) {
		LOG.error(error);
		if (connection) connection.destroy();
		return { result: false, message: "500 Internal Server Error" };
	}
};

const loginUser = (connection, jsonReq) => {
	return new Promise((resolve, reject) => {
		connection.query("SELECT * from users where username = ? and isDeleted = 0", [jsonReq.username], (error, results) => {
			if (error) { return reject(error); }

			if (!results || !results[0]) {
				LOG.info(`Record for username '${jsonReq.username}' not found.`);
				return resolve(false);
			}

			const hashPassword = sha512(jsonReq.password, results[0].salt);
			return (results[0].password == hashPassword) ? resolve(results[0]) : resolve(false);
		});
	});
}


// Hashing algorithm: SHA512
const sha512 = (password, salt) => crypto.createHmac("sha512", salt).update(password).digest("hex");

const validateRequest = (jsonReq) => (jsonReq && jsonReq.username && jsonReq.password);
