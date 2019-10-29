import { router } from "/framework/js/router.mjs";
import { securityguard } from "/framework/js/securityguard.mjs";
import { session } from "/framework/js/session.mjs";

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
                username: document.querySelector('#username').value,
                password: document.querySelector('#password').value
            };

            const responseObject = await (await fetch(APP_CONSTANTS.API_LOGIN, { method: "POST", body: JSON.stringify(requestObject) })).json();
            if (!responseObject.result) {
                alert(responseObject.message);
                return;
            }

            securityguard.setCurrentRole(APP_CONSTANTS.USER_ROLE);
            session.set("userId", responseObject.results.user.userId);

            router.loadPage(APP_CONSTANTS.GETDETAILS_THTML, responseObject.results);

        } catch (error) {
            console.error(error);
        };
    });
};

export const login = { init }; 