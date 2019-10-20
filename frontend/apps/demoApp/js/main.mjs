import { router } from "/framework/js/router.mjs";

const init = async () => {
    try {
        document.querySelector("p#login-page").onclick = () => router.loadPage(APP_CONSTANTS.LOGIN_THTML);

        loginFormSubmitAction();
        
    } catch (error) {
        console.error(error);
    }
};

const loginFormSubmitAction = () => {
    const formElement = document.querySelector("form#sample-form");
     
    if (!formElement) {
        console.error("Sample Form not found.");
        return;
    }

    formElement.querySelector("#register").addEventListener("click", async (event) => {
        event.preventDefault();
        try {
            if((ValidateFullName(document.querySelector('#name').value)).value)
            {
            const requestObject = {
                username: document.querySelector('#uname').value,
                fullName: document.querySelector('#name').value,
                password: document.querySelector('#psw').value
            };

            const responseObject = await (await fetch(APP_CONSTANTS.API_REGISTER, { method: "POST", body: JSON.stringify(requestObject) })).json();
            if (responseObject.result == true) {
                alert(responseObject.message);
            }
            else {
                alert(responseObject.message);
            }
        }
        else
        {
            return;
        }
        } catch (error) {
            console.error(error);
        }

    });
};

const ValidateFullName = async (inputText) => {
    try{
        let fullNameformat = /^[a-zA-Z ]+$/;
        if (inputText.match(fullNameformat)) {
            document.querySelector('#name').focus();
            return true;
        }
        else {
            alert("You have entered an invalid full name!");
            document.querySelector('#name').focus();
            return false;
        }
    } catch(error)
    {
        console.error(error);
    }
}




const callTestAPI = async () => {
    try {

        const requestObject = {};
        const responseObject = await (await fetch(APP_CONSTANTS.API_TEST, { method: "POST", body: JSON.stringify(requestObject) })).json();

        console.log(responseObject);

    } catch (error) {
        console.error("Unable to call API", error);
    }
};

export const main = { init };