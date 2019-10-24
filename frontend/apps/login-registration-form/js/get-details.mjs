import { router } from "/framework/js/router.mjs";

const init = async () => {
    try {
        await fillUsersDetails();
        await editUserDetails();
        await deleteUser();
    } catch (error) {
        console.error(error);
    }
};

const fillUsersDetails = async () => {

    const table = document.querySelector('table#dataTable');

    const editButton = `<button type="button" id="editButton"> EDIT </button>`;
    const deleteButton = `<button type="button" id="deleteButton"> DELETE </button>`

    try {
        const requestObject = {};

        const responseObject = await (await fetch(APP_CONSTANTS.API_GETDETAILS, { method: "POST", body: JSON.stringify(requestObject) })).json();
        console.log(responseObject);
        if (responseObject.result) {
            for (var i = 0; i < responseObject.results.length; i++) {
                const row = table.insertRow(i + 1);
                const cell1 = row.insertCell(0);
                const cell2 = row.insertCell(1);
                const cell3 = row.insertCell(2);
                const cell4 = row.insertCell(3);
                cell1.innerHTML = responseObject.results[i].username;
                cell2.innerHTML = responseObject.results[i].fullName;
                cell3.innerHTML = editButton;
                cell4.innerHTML = deleteButton;
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
        router.loadPage(APP_CONSTANTS.REGISTER_THTML);
    }
    catch (error) {
        console.error(error);
    };
});

const editUserDetails = async () => {
    const buttons = document.querySelectorAll('#editButton');
    console.log(buttons);
    for (const rowButton of buttons) {
        rowButton.addEventListener('click', async (event) => {
            try {
                const num = event.target.parentElement.parentElement.rowIndex;

                const requestObject = {};

                let responseObject = await (await fetch(APP_CONSTANTS.API_GETDETAILS, { method: "POST", body: JSON.stringify(requestObject) })).json();
                if (responseObject.result) {
                    router.loadPage(APP_CONSTANTS.UPDATE_THTML);
                    delete localStorage.fullName;
                    delete localStorage.username;
                    localStorage.setItem('username', document.querySelector('table#dataTable').rows[num].cells[0].innerHTML);
                    localStorage.setItem('fullName', document.querySelector('table#dataTable').rows[num].cells[1].innerHTML);
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

const deleteUser = async () => {
    const buttons = document.querySelectorAll('#deleteButton');
    console.log(buttons);
    for (const rowButton of buttons) {
        rowButton.addEventListener('click', async (event) => {
            try {
                const num = event.target.parentElement.parentElement.rowIndex;
                const requestObject = {
                    username: document.querySelector('table#dataTable').rows[num].cells[0].innerHTML
                };
                let responseObject = await (await fetch(APP_CONSTANTS.API_DELETE, { method: "POST", body: JSON.stringify(requestObject) })).json();

                alert(responseObject.message);

            }
            catch (error) {
                console.error(error);
            };
        });
    };
};

export const getDetails = { init };