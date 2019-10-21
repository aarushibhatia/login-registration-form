
const database = require("../db/db.js");

exports.doService = async jsonReq => {
	try {
		let confirmation = await database.updateData(jsonReq.username, jsonReq.fullName, jsonReq.password);
		if(confirmation.result)
		{
			return {result:true, message:"User details updated."} ;
		}
		else
		{
			return {result:false, message:"Error."} ;
		}	
	}
	catch (error) {
		console.error(error);
	}


	return {};
}








