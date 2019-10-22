import { router } from "/framework/js/router.mjs";

const init = async () => {
    try {
        console.log('checking');
        document.querySelector('#name').value =   localStorage.getItem('fullName');
        document.querySelector('#psw').value =   localStorage.getItem('password');
    } catch (error) {
        console.error(error);
    }
};

document.querySelector('#logout').addEventListener('click', async (event) => {
    try {
        router.loadPage(APP_CONSTANTS.REGISTER_THTML);
    }
    catch (error) {
        console.error(error);
    }});

document.querySelector("#edit").addEventListener("click", async (event) => {
    event.preventDefault();
    try {

        const requestObject = {
            username: localStorage.getItem('username'),
            fullName: document.querySelector('#name').value,
            password: document.querySelector('#psw').value
        };

        const responseObject = await (await fetch(APP_CONSTANTS.API_UPDATE, { method: "POST", body: JSON.stringify(requestObject) })).json();
        if (responseObject.result == true) {
            alert(responseObject.message);
        }
        else {
            alert(responseObject.message);
        }


    } catch (error) {
        console.error(error);
    }
});



export const edit = { init };