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

        const isUpdated = await updateUserDetails(connection, jsonReq);
        if (!isUpdated) {
            LOG.info("User details could not be updated.");
            connection.destroy();
            return { result: false, message: "Record not edited." };
        }

        LOG.info("User details updated.")
        connection.destroy();
        return { result: true, message: "User details updated." };
    }

    catch (error) {
        LOG.error(error);
        connection.destroy();
        return { result: false, message: "500 Internal Server Error." };
    }
}

const updateUserDetails = (connection, jsonReq) => {
    return new Promise((resolve, reject) => {
        const salt = crypto.randomBytes(16).toString('hex');

        const query = "UPDATE users SET fullName = ?, password =? where username = ?";
        const queryParams = [jsonReq.fullName, sha512(jsonReq.password, salt), jsonReq.username];

        connection.query(query, queryParams, function (error, result) {
            if (error) {
                LOG.error(error);
                return reject(false);
            }
            LOG.info(result);
            return resolve(true);
        });
    });
};

const sha512 = (password, salt) => crypto.createHmac("sha512", salt).update(password).digest("hex");

const validateRequest = (jsonReq) => (jsonReq && jsonReq.username && jsonReq.fullName && jsonReq.password);




