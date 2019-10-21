import { autoforms } from "./lib/autoforms/autoforms.mjs";
import { router } from "/framework/js/router.mjs";

const init = async () => {

    try {
        const formStatus = await initForm();
        if (!formStatus) throw new Error("Form initiation failed.");

    } catch (error) {
        console.error(error);
    }
};


const initForm = async () => {

    const config = {
        bindingDivElement: document.querySelector(`#login-form-div`),
        schemaPath: `${APP_CONSTANTS.APP_PATH}/js/schemas/generator/login/loginSample.json`
    };

    try {
        const setupStatus = await autoforms.setupForm(config);
        if (!setupStatus) throw new Error("Unable to setup form.");

        initAndRunSubmitLoop(config.bindingDivElement);

        return true;

    } catch (error) {
        console.error(error);
        return false;
    }
};


const initAndRunSubmitLoop = async (bindingDivElement) => {
    try {
        let resolvedState = false;
        while (!resolvedState) {
            let fieldData = await autoforms.mapFormToJSON(bindingDivElement);
            if (!fieldData) throw new Error("Cannot map field data, please recheck configuration.");
            resolvedState = await handleSubmit(fieldData);
        }
    } catch (error) {
        console.error(error);
    }
    return;
};


const handleSubmit = async (fieldData) => {
    try {
        let responseObject = await loginUser(fieldData);
        
        return responseObject.result;
    } catch (error) {
        console.error(error);
     
    }
};


const loginUser = async (fieldData) => {

const requestObject = {
    username: fieldData.username,
    password:  fieldData.password
}

    const responseObject = await (await fetch(APP_CONSTANTS.API_LOGIN, { method: "POST", body: JSON.stringify(requestObject) })).json();

    if (responseObject.result == true) {
        alert(responseObject.message);
        router.loadPage(APP_CONSTANTS.LIST_THTML);
   }
   else {
       alert(responseObject.message);
   }

    const obj = { result: false };
    return obj;
};


export const login = { init };