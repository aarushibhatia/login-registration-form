const database = require("../../db/db.js");

exports.doService = async jsonReq => {
    let connection;
    try {
        connection = database.getConnection();

        const isDetailsReceieved = await getUserDetails(connection, jsonReq);
        if (!isDetailsReceieved) {
            LOG.info("Error receiving user details.");
            connection.destroy();
            return { result: false, message: "Could not fetch details of user." };
        }

        LOG.info("Received user details.");
        connection.destroy();
        return { result: true, message: "User details fetched.", results: isDetailsReceieved };
    }

    catch (error) {
        LOG.error(error);
        connection.destroy();
        return { result: false, message: "500 Internal Server Error." };
    }
}

const getUserDetails = (connection, jsonReq) => {
    return new Promise ((resolve, reject) => {
        const sql = "SELECT fullName, username from users where isDeleted = 0";
        connection.query(sql, [jsonReq.username], function (error, result) {
            if (error) {
                LOG.error(error);
                return reject(false);
            }
            LOG.info(result);
            return resolve(result);
        });
    });
};





