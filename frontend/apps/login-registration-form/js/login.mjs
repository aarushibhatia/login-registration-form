import { router } from "/framework/js/router.mjs";

const init = async () => {
    try {
        loginFormSubmitAction();
    } catch (error) {
        console.error(error);
    }
};

const loginFormSubmitAction = () => {
    const formElement = document.querySelector("form#login-form");
    if (!formElement) {
        LOG.error("Login Form not found.");
        return;
    }

    formElement.addEventListener("submit", async (event) => {
        event.preventDefault();
        try {
            const requestObject = {
                username: document.querySelector('#uname').value,
                password: document.querySelector('#psw').value
            };

            const responseObject = await (await fetch(APP_CONSTANTS.API_LOGIN, { method: "POST", body: JSON.stringify(requestObject) })).json();
            if (responseObject.result == true) {
                router.loadPage(APP_CONSTANTS.GETDETAILS_THTML);
                console.log(responseObject.results);
            }
            else {
                alert(responseObject.message);
            }

        } catch (error) {
            console.error(error);
        };
    });
};

export const login = { init }; 