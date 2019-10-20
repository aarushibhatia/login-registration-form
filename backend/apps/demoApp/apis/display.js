const database = require("../db/db.js");

exports.doService = async jsonReq => {
	
	try {
		LOG.info("Got fetch request for registered users. " );
	let data = await database.getTableData();

		if(data.message == "true"){
			return {result: data.result , message: "true"} ;

		}  
		else
		{
			return {result:false, message : "false"} ;
		}
	} catch (error) {
		LOG.error(error);
		return { result: false, message: "501 Internal Server Error" };
	}
}







