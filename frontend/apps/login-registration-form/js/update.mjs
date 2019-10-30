import { router } from "/framework/js/router.mjs";
import { securityguard } from "/framework/js/securityguard.mjs";

const init = async () => {
    try {
        document.querySelector('#full-name').value = localStorage.getItem('fullName');
    } catch (error) {
        console.error(error);
    }
};

document.querySelector('#logout').addEventListener('click', async (event) => {
    try {
        securityguard.setCurrentRole(APP_CONSTANTS.GUEST_ROLE);
        router.loadPage(APP_CONSTANTS.REGISTER_THTML); 
    }
    catch (error) {
        console.error(error);
    }
});

document.querySelector("#edit").addEventListener("click", async (event) => {
    event.preventDefault();
    try {
        const requestObject = {
            username: localStorage.getItem('username'),
            fullName: document.querySelector('#full-name').value,
            password: document.querySelector('#password').value
        };

        const responseObject = await (await fetch(APP_CONSTANTS.API_UPDATE, { method: "POST", body: JSON.stringify(requestObject) })).json();
        alert(responseObject.message);

    } catch (error) {
        console.error(error);
    }
});

export const update = { init };