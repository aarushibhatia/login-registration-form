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
                username: document.querySelector('#username').value,
                password: document.querySelector('#password').value
            };

            const responseObject = await (await fetch(APP_CONSTANTS.API_LOGIN, { method: "POST", body: JSON.stringify(requestObject) })).json();
            if (responseObject.result == true) {
                securityguard.setPermissionsMap(APP_CONSTANTS.PERMISSIONS_MAP);
                securityguard.setCurrentRole(securityguard.getCurrentRole() || APP_CONSTANTS.USER_ROLE);
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