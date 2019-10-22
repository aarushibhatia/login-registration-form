import { router } from "/framework/js/router.mjs";

const init = async () => {
    try {
        document.querySelector("p#login-page").onclick = () => router.loadPage(APP_CONSTANTS.LOGIN_THTML);
        registerFormSubmitAction();
    } catch (error) {
        console.error(error);
    }
};

const registerFormSubmitAction = () => {
    const formElement = document.querySelector("form#registration-form");

    if (!formElement) {
        console.error("Sample Form not found.");
        return;
    }

    formElement.querySelector("#register").addEventListener("click", async (event) => {
        event.preventDefault();
        try {
            if (validateFullName(document.querySelector('#name').value)) {
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
            else {
                return;
            }
        } catch (error) {
            console.error(error);
        }

    });
};

const validateFullName = (inputText) => {
    try {
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
    } catch (error) {
        console.error(error);
    }
}

export const register = { init }; 