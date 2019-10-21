
const database = require("../db/db.js");

exports.doService = async jsonReq => {
	try {
		let confirmation = await database.populateData(jsonReq.username, jsonReq.name, jsonReq.password);
		if(confirmation.result)
		{
			return {result:true, message:"User registered."} ;
		}
		else
		{
			return {result:false, message:"Already a user."} ;
		}	
	}
	catch (error) {
		console.error(error);
	}


	return {};
}








