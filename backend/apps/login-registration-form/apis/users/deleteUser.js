const database = require("../../db/db.js");

exports.doService = async jsonReq => {
    let connection;
    try {
        if (!validateRequest(jsonReq)) {
            return { result: false, message: "Insufficient Parameters." };
        }

        connection = database.getConnection();

        const isDeleted = await deleteUser(connection, jsonReq);
        if (!isDeleted) {
            LOG.error("Record could not be deleted.");
            connection.destroy();
            return { result: false, message: "Record could not be deleted" };
        }

        LOG.info("Record deleted successfully.");
        connection.destroy();
        return { result: false, message: "Record deleted successfully." };
    }

    catch (error) {
        LOG.error(error);
        connection.destroy();
        return { result: false, message: "500 Internal server error." };
    }
};

const deleteUser = (connection, jsonReq) => {
    return new Promise((resolve, reject) => {
        connection.query('UPDATE users SET isDeleted = 1 where username = ?', [jsonReq.username], (error, result) => {
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

const validateRequest = (jsonReq) => (jsonReq && jsonReq.username);