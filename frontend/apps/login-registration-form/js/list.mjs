import { router } from "/framework/js/router.mjs";

const init = async () => {
    try {

        await fillTableAction();
        await enableEdit();
    } catch (error) {
        console.error(error);
    }
};

const fillTableAction = async () => {

    let table = document.querySelector('table#dataTable');

    let button = `<button type="button" id="button"> EDIT </button>`;

    try {
        const requestObject = {};

        const responseObject = await (await fetch(APP_CONSTANTS.API_DISPLAY, { method: "POST", body: JSON.stringify(requestObject) })).json();
        if (responseObject.message == "true") {
            for (var i = 0; i < responseObject.result.length; i++) {
                let row = table.insertRow(i + 1);
                let cell1 = row.insertCell(0);
                let cell2 = row.insertCell(1);
                let cell3 = row.insertCell(2);
                cell1.innerHTML = responseObject.result[i].username;
                cell2.innerHTML = responseObject.result[i].fullName;
                cell3.innerHTML = button;
            }
        }
        else {
            alert(responseObject.message);
        }
    }
    catch (error) {
        console.error(error);
    }
};

document.querySelector('#logout').addEventListener('click', async (event) => {
    try {
        router.loadPage(APP_CONSTANTS.MAIN_THTML);
    }
    catch (error) {
        console.error(error);
    }
});

const enableEdit = async () => {

    const buttons = document.querySelectorAll('#button');
    console.log(buttons);
    for (const rowButton of buttons) {
        rowButton.addEventListener('click', async (event) => {
            try {
                let num = event.target.parentElement.parentElement.rowIndex;
                const requestObject = {
                    username: document.querySelector('table#dataTable').rows[num].cells[0].innerHTML
                };
                let responseObject = await (await fetch(APP_CONSTANTS.API_GETDETAILS, { method: "POST", body: JSON.stringify(requestObject) })).json();
                if (responseObject.result) {
                    router.loadPage(APP_CONSTANTS.EDIT_THTML);
                    delete localStorage.fullName;
                    delete localStorage.password;
                    delete localStorage.username;
                    localStorage.setItem('username', document.querySelector('table#dataTable').rows[num].cells[0].innerHTML);
                    localStorage.setItem('fullName', responseObject.results[0].fullName);
                    localStorage.setItem('password', responseObject.results[0].password);
                }
                else {
                    alert('No edit page');
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
}



export const list = { init };