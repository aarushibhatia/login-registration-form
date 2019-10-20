module.exports.doService = async jsonReq => {

     const trueResponse = {
         result : true,
         results : jsonReq,
         message : "Worked!"
     };

     const falseResponse = {
         result : false,
         message : "Didn't work."
   };


 

     return trueResponse;

}




