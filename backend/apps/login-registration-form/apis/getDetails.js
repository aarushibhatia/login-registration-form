const database = require("../db/db.js");

exports.doService = async jsonReq => {
    try {
        let confirmation = await getDetails(jsonReq.username);
        if (confirmation.result) {
            LOG.info(confirmation.results);
            return { result: confirmation.result, results: confirmation.results };
        }
        else {
            return { result: false };
        }
    }
    catch (error) {
        console.error(error);
    }
    return {};
}

const getDetails = (username) => {
    return new Promise(function (resolve, reject) {
        const sql = "select fullName, password from users where username=? and isDeleted = 0";
        database.connection.query(sql, [username], function (error, result) {
            if (error) {
                LOG.error(error);
                return reject(error);
            }
            else {
                return resolve({ result: true, results: result });
            }
        });
    });
};





