import { utils } from "./helpers/utils.mjs";

/**
 * Entry point for the Form to JSON Mapper.
 * Registers the submit event listener for the enclosed form
 * 
 * @param {HTMLDivElement} enclosingElement - querySelector reference of the HTML Div that the form needs to be placed inside
 * @param {Boolean} trueFormMapping - Specifies if the mapping is to be done for a form. Making it false skip all validations.
 * @returns {Promise}
 */
const init = (enclosingElement, trueFormMapping = true) => {

    if (!trueFormMapping) return (enclosingElement) ? mapFormToJSON(enclosingElement) : false;

    return new Promise((resolve, reject) => {
        try {
            if (!enclosingElement) return resolve(false);

            let formElement = enclosingElement.querySelector("form");
            if (!formElement) return resolve(false);

            formElement.addEventListener("submit", async function (event) {
                event.preventDefault();
                const requiredFlag = await markRequired(formElement);
                const validFlad = checkIfValid(formElement);
                if (requiredFlag && validFlad) {
                    const mappedObject = mapFormToJSON(formElement);
                    return resolve(mappedObject);
                }
            });
        } catch (error) {
            LOG.error(error);
            return reject(false);
        }
    });
};

/**
 * Mark inpuit elements required if specified.
 * Checks if the required condition is fulfilled.
 * 
 * @param {HTMLElement} formElement - Form Element reference
 * @returns {Promise<boolean>}
 */
const markRequired = (formElement) => {
    return new Promise(resolve => {
        const requiredElements = formElement.querySelectorAll(".required");
        Object.values(requiredElements).forEach((element) => {

            if (element.classList.contains(AUTOFORM_CONSTANTS.bypassIsRequiredClassName)) return;

            if (element.required != true) element.required = true;

            switch (element.type) {
                case "radio":
                    let radioLabelId = `${element.name}__label-div`;
                    let radioListHeader = formElement.querySelector(`#${radioLabelId}`);
                    if (radioListHeader) {
                        let radioElements = radioListHeader.parentElement.querySelectorAll("input");
                        let radioStatuses = Object.values(radioElements).map((element) => {
                            element.onclick = function (event) {
                                if (radioListHeader.className.includes("invalid-radio")) radioListHeader.classList.remove("invalid-radio");
                            };
                            return element.checked;
                        });
                        if (radioStatuses.includes(true)) {
                            if (radioListHeader.className.includes("invalid-radio")) radioListHeader.classList.remove("invalid-radio");
                        } else {
                            if (!radioListHeader.className.includes("invalid-radio")) radioListHeader.classList.add("invalid-radio");
                            return resolve(false);
                        }
                    };
                    break;
                default:
                    let isDirty = utils.checkStringDeclaration(element.value);
                    if (!isDirty) {
                        element.parentElement.classList.add("is-invalid");
                        return resolve(false);
                    }
            };
        });
        return resolve(true);
    });
};

/**
 * Checks if any invalid inputs are being submitted
 * 
 * @param {HTMLElement} formElement - Form Element reference
 * @returns {Boolean}
 */
const checkIfValid = (formElement) => (formElement.querySelectorAll(".is-invalid").length == 0) ? true : false;

/**
 * Maps form data to an Object
 * 
 * @param {HTMLElement} formElement - Form Element reference
 * @returns {*}
 */
const mapFormToJSON = (formElement) => {
    const mappedObject = {};

    const inputElementsList = formElement.querySelectorAll("input");
    Object.values(inputElementsList).forEach((inputElement) => {
        switch (inputElement.type) {
            case "submit":
            case "reset":
            case "button":
                break;
            case "checkbox":
                if (!mappedObject[inputElement.id])
                    mappedObject[inputElement.id] = (inputElement.checked) ? "1" : "0";
                else if (typeof mappedObject[inputElement.id] == "object")
                    mappedObject[inputElement.id].push((inputElement.checked) ? "1" : "0");
                else if (typeof mappedObject[inputElement.id] == "string") {
                    let initialValue = mappedObject[inputElement.id];
                    mappedObject[inputElement.id] = [initialValue];
                    mappedObject[inputElement.id].push((inputElement.checked) ? "1" : "0");
                }
                break;
            case "radio":
                if (!inputElement.checked)
                    break;
            default:
                if (!mappedObject[inputElement.name])
                    mappedObject[inputElement.name] = inputElement.value;
                else if (typeof mappedObject[inputElement.name] == "object")
                    mappedObject[inputElement.name].push(inputElement.value);
                else if (typeof mappedObject[inputElement.name] == "string") {
                    let initialValue = mappedObject[inputElement.name];
                    mappedObject[inputElement.name] = [initialValue];
                    mappedObject[inputElement.name].push(inputElement.value);
                }
        }
    });

    const textareaElementsList = formElement.querySelectorAll("textarea");
    Object.values(textareaElementsList).forEach((textareaElement) => {
        switch (textareaElement.type) {
            case "text":
            default:
                if (!mappedObject[textareaElement.name])
                    mappedObject[textareaElement.name] = textareaElement.value;
                else if (typeof mappedObject[textareaElement.name] == "object")
                    mappedObject[textareaElement.name].push(textareaElement.value);
                else if (typeof mappedObject[textareaElement.name] == "string") {
                    let initialValue = mappedObject[textareaElement.name];
                    mappedObject[textareaElement.name] = [initialValue];
                    mappedObject[textareaElement.name].push(textareaElement.value);
                }
        };
    });

    return mappedObject;
};

/**
 * Export for formToJSONMapper.mjs
 */
export const mapper = { init };