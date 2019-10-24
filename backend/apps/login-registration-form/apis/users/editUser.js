const database = require("../../db/db.js");
const uuidv4 = require("../../3p/node_modules/uuid/v4.js");
const crypto = require("crypto");

exports.doService = async jsonReq => {
    let connection;
    try {
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
        const sql = "SELECT exists (SELECT * from users where username = ? and isDeleted = 0) as userExists";
        connection.query(sql, [jsonReq.username], function (error, result) {
            if (error) {
                LOG.error(error);
                return reject(false);
            }
            if (result[0].userExists > 0) {
                connection.query('UPDATE users SET isDeleted = 1 where username = ?', [jsonReq.username]);
                connection.query("INSERT INTO users (uuid, username, fullName, password, salt, timestamp, isDeleted) VALUES(? , ?, ? , ?, ?, ?, ?)", [uuidv4(), jsonReq.username, jsonReq.fullName, crypto.pbkdf2Sync(jsonReq.password, salt, 1000, 64, 'sha512').toString('hex'), salt, new Date().getTime(), 0], function (error, result) {
                    if (error) {
                        LOG.error(error);
                        return reject(false);
                    }
                    LOG.info(result);
                    return resolve(true);
                });
            };
        });
    });
};





