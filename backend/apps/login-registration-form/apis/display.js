const database = require("../db/db.js");

exports.doService = async jsonReq => {
	try {
		LOG.info("Got fetch request for registered users. ");
		let data = await getTableData();
		if (data.message == "true") {
			return { result: data.result, message: "true" };
		}
		else {
			return { result: false, message: "false" };
		}
	} catch (error) {
		LOG.error(error);
		return { result: false, message: "501 Internal Server Error" };
	}
}

const getTableData = () => {
	return new Promise(function (resolve, reject) {
		const sql = "select * from users where isDeleted = 0";
		database.connection.query(sql, function (error, result) {
			if (error) {
				LOG.error(error);
				return reject(error);
			}
			else {
				LOG.info(result);
				return resolve({ result: result, message: "true" });
			}
		});
	});


};





