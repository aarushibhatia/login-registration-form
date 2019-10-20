const database = require("../db/db.js");

exports.doService = async jsonReq => {
	
	try {
		LOG.info("Got login request for username: " + jsonReq.username);
	let validatedData = await database.validateData(jsonReq.username, jsonReq.password);

		if(validatedData.result){
			return {result:true, message:"User logged in."} ;

		}  
		else
		{
			return {result:false, message:"Invalid credentials."} ;
		}
	} catch (error) {
		LOG.error(error);
		return { result: false, message: "501 Internal Server Error" };
	}
}







