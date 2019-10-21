// 
// return {
//     result: true|false,                     // mandatory
//     message: "Specific error message."      // optional
// };
// 

const regEx = {
    email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
};

const functionName = (element) => {
    if (!element || !element.value) return;
    
    element.value = element.value.trim();
    if (element.value == null || element.value.trim() == "") return { result: false, message: "Cannot be empty.!" };

    return { result: true };
};

const checkIfNotFutureDate = (element) => {
    if (!element || !element.value) return;

    const enteredTimestamp = Date.parse(element.value);
    const currentTimestamp = Date.now();

    if (enteredTimestamp > currentTimestamp) return { result: false, message: "Please enter a valid date.!" };

    return { result: true };
};

const validateEmail = (element) => {
    if (!element || !element.value) return;

    if (!regEx.email.test(element.value)) return { result: false, message: "Please enter a valid email.!" };

    return { result: true };
};

/**
 * Export for custom user function definitons
 */
export const rules = { functionName, checkIfNotFutureDate, validateEmail };