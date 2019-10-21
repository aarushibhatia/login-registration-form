/**
 * Checks if a provided value resembles a non-empty string
 * 
 * @function checkStringDeclaration
 * @param {*} value - Value to be tested for a non-empty string
 * @returns {Boolean}
 */
const checkStringDeclaration = (value) => (value && value.toString().trim() != "") ? true : false;

/**
 * Creates an HTML Element and Appends it to the DOM
 * 
 * @param {String} tagName - Name of the HTML tag to be created and appended
 * @param {Object} tagAttributesObject - Attribute names and their values as key-value pair in the object
 * @param {String} parentElementId - Id of the parent HTML tag that this new element needs to be appended to
 * @param {*} innerHTML - HTML to be placed inside the newly created element before appending
 * @returns {Boolean}
 */
const createAndAppendElement = (tagName = "div", tagAttributesObject, parentElementId, innerHTML) => {
    if (!parentElementId) return false;

    let newElement = document.createElement(tagName);
    if (tagAttributesObject)
        for (let attributeName in tagAttributesObject)
            newElement.setAttribute(attributeName, tagAttributesObject[attributeName]);

    if (innerHTML) newElement.innerHTML = innerHTML;

    let parentElement;

    if (!AUTOFORM_CONSTANTS.BINDING_PARENT_ELEMENT)
        parentElement = document.querySelector(`#${parentElementId}`);
    else
        parentElement = (parentElementId == AUTOFORM_CONSTANTS.BINDING_PARENT_ELEMENT.id) ? AUTOFORM_CONSTANTS.BINDING_PARENT_ELEMENT : AUTOFORM_CONSTANTS.BINDING_PARENT_ELEMENT.querySelector(`#${parentElementId}`);

    parentElement.appendChild(newElement);
    return true;
};

/**
 * Creates an HTML Element and Prepends it to the target element
 * 
 * @param {String} tagName - Name of the HTML tag to be created and appended
 * @param {Object} tagAttributesObject - Attribute names and their values as key-value pair in the object
 * @param {HTMLElement} targetElement - querySelector reference of the element that this new element needs to be prepended to
 * @param {String} innerHTML - HTML to be placed inside the newly created element before prepending
 * @returns {Boolean}
 */
const createAndPrependElement = (tagName = "div", tagAttributesObject, targetElement, innerHTML = "") => {
    if (!targetElement) return false;

    let newElement = document.createElement(tagName);
    if (tagAttributesObject)
        for (let attributeName in tagAttributesObject)
            newElement.setAttribute(attributeName, tagAttributesObject[attributeName]);

    if (innerHTML) newElement.innerHTML = innerHTML;

    targetElement.parentElement.insertBefore(newElement, targetElement);

    return true;
};

/**
 * Appends HTML Code to the provided parent element
 * 
 * @param {String} codeBlock - HTML Code to be appended
 * @param {String} parentElementId - Parent element ID
 * @returns {Boolean}
 */
const appendHTML = (codeBlock = "", parentElementId) => {
    if (!parentElementId) return false;

    let parentElement = (AUTOFORM_CONSTANTS.BINDING_PARENT_ELEMENT) ? AUTOFORM_CONSTANTS.BINDING_PARENT_ELEMENT : document.querySelector(`#${parentElementId}`);
    if (!parentElement) return false;

    parentElement.innerHTML += codeBlock;
    return true;
};

/**
 * Upgrades all registered MDL components in the DOM using componentHandler
 * Also, makes ose of Monkshu's $$.require(...)
 */
const upgradeMDL = async () => {
    try {
        await $$.require(`${APP_CONSTANTS.APP_PATH}/3p/material.min.js`);
        componentHandler.upgradeAllRegistered();

        getmdlSelect.init(".getmdl-select");
        componentHandler.upgradeDom();

        return true;
    } catch (error) {
        LOG.error(error);
        return false;
    }
};

/**
 * Initiates the loader for the form
 * 
 * @param {String} parentElementId - Parenty element ID to append the loader to
 */
const initFormLoader = async (parentElement) => {
    const codeBlock = `<div id="form-loader-container" style="text-align: center;"><div class="form-loader"><div></div><div></div><div></div><div></div></div></div>`;
    appendHTML(codeBlock, parentElement.id);
};

/**
 * Hides the loader for the form
 * 
 * @param {String} parentElementId - Parent element ID that contains the loader animation div and the form element
 */
const hideFormLoader = async (parentElement) => parentElement.querySelector("#form-loader-container").style.display = "none";

/**
 * Takes in timestamp and returns readable date
 * 
 * @param {Number} timestamp - UNIX Timestamp value
 * @returns {String}
 */
const timestampToReadableDate = (timestamp) => {
    if (!timestamp) return;
    let date = new Date(parseInt(timestamp));

    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');

    return month + '/' + day + '/' + year;
};

/**
 * Export for utils.mjs
 */
export const utils = { checkStringDeclaration, createAndAppendElement, createAndPrependElement, appendHTML, upgradeMDL, initFormLoader, hideFormLoader, timestampToReadableDate };