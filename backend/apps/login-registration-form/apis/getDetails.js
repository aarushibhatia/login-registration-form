
const database = require("../db/db.js");

exports.doService = async jsonReq => {
    try {
        let confirmation = await database.getDetails(jsonReq.username);
        if (confirmation.result) {
            LOG.info(confirmation.results);
            return { result: confirmation.result, results : confirmation.results };
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








