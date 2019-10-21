import { utils } from "./helpers/utils.mjs";
import { genFields } from "./helpers/fields.mjs";

/**
 * Begins the actual form generation.
 * Creates the form element and appends it to the provided element.
 * 
 * @param {HTMLElement} bindingElement - Reference of the HTML Element the form needs to be appended to
 * @param {Object} data - Form Schema Object along with the MetaData fields
 * @returns {Boolean}
 */
export const generateForm = (bindingElement, data, isPartial) => {
    try {
        const schema = data.schema;
        if (!schema) throw new Error("Corrupt form schema.");

        const formId = utils.checkStringDeclaration(data.form_id) ? data.form_id.trim() : AUTOFORM_CONSTANTS.formId;
        const autoComplete = utils.checkStringDeclaration(data.autoComplete) ? data.autoComplete : AUTOFORM_CONSTANTS.autoCompleteStatus;
        const sectionLayout = utils.checkStringDeclaration(data.sectionLayout) ? data.sectionLayout.trim() : AUTOFORM_CONSTANTS.sectionLayout;
        const css = utils.checkStringDeclaration(data.css) ? data.css.trim() : AUTOFORM_CONSTANTS.css;

        const formAttributes = {
            id: `${formId}`,
            autocomplete: `${autoComplete}`
        };
        if (utils.checkStringDeclaration(data.action)) formAttributes.action = data.action;
        if (utils.checkStringDeclaration(data.method)) formAttributes.method = data.method;

        const elementTag = (!isPartial) ? "form" : "div";

        const isFormAppended = utils.createAndAppendElement(elementTag, formAttributes, bindingElement.id);
        if (!isFormAppended) throw new Error("Form not created.");

        const areAllSectionsCreated = createSections(schema, formId, sectionLayout, css);
        if (!areAllSectionsCreated) throw new Error("Discontinuity in form sections.");

        if (data.submit) createSubmitGrid(data.submit, formId);

    } catch (error) {
        throw error;
    }
};

/**
 * Creation of either Collapsible or Tabbable section wrapper
 * 
 * @param {Object} schema - Form Schema Object
 * @param {String} formId - Form Id
 * @param {String} sectionLayout - Form layout type
 * @param {String} css 
 * @returns {Boolean}
 */
const createSections = (schema, formId, sectionLayout, css) => {
    try {
        if (sectionLayout == `tabbable`) {

            const tabGroupAttributes = {
                id: `tab_group`,
                class: `mdl-tabs mdl-js-tabs`
            };
            utils.createAndAppendElement(`div`, tabGroupAttributes, formId);

            const tabBarAttributes = {
                id: `tab_group__tab_bar`,
                class: `mdl-tabs__tab-bar`
            };
            utils.createAndAppendElement(`div`, tabBarAttributes, `tab-group`);
        }

        Object.values(schema.sections).forEach((section) => {
            const isPrimary = (section.isPrimary) ? section.isPrimary : AUTOFORM_CONSTANTS.isPrimary;
            const modifiedClass = (isPrimary) ? "-primary" : "";

            if (sectionLayout == `tabbable`) createTabHead(section, isPrimary, css);
            else if (sectionLayout == `collapsible`) {
                const divAttributes = {
                    id: `${section.id}`,
                    class: `section${modifiedClass}`
                };
                utils.createAndAppendElement(`div`, divAttributes, formId);
                createSectionHead(section, isPrimary);
            }

            createElementBody(section, sectionLayout, isPrimary, css);
        });
    } catch (error) {
        LOG.error(error);
        return false;
    }
    return true;
};

/**
 * Creates the Tab Header in Tabbable layout
 * 
 * @param {Object} section - Section Object from Schema
 * @param {Boolean} isPrimary - If the section is Primary
 */
const createTabHead = (section, isPrimary, css) => {

    const activeClass = (isPrimary) ? "is-active" : "";
    const tabHeadAttributes = {
        href: `#${section.id}__target`,
        class: `mdl-tabs__tab ${activeClass}`
    };
    utils.createAndAppendElement(`a`, tabHeadAttributes, `tab_group__tab_bar`, section.name);
    return true;
};

/**
 * Creates Section Header in Collapsible Layout
 * 
 * @param {Object} section - Section Object from Schema
 * @param {Boolean} isPrimary - If the section is Primary
 */
const createSectionHead = (section, isPrimary) => {

    const sectionHeadAttributes = {
        class: `section_head`,
        id: `${section.id}__head`
    };
    utils.createAndAppendElement(`div`, sectionHeadAttributes, section.id);

    if (utils.checkStringDeclaration(section.name)) {
        const sectionHeaderAttributes = {
            class: `section-heading`,
            id: `${section.id}__header`
        };
        utils.createAndAppendElement(`h4`, sectionHeaderAttributes, sectionHeadAttributes.id, section.name);
    }

    if (!isPrimary) addCollapsibleController(section.id);
};

/**
 * Creates the section body containing rows and columns.
 * Each row houses various columns.
 * Each Column houses a type of input field(s)
 * 
 * @param {Object} section - Section Object from Schema
 * @param {String} sectionLayout - Form layout type
 * @param {Boolean} isPrimary - If the section is Primary
 * @param {String} css 
 */
const createElementBody = (section, sectionLayout, isPrimary, css) => {
    try {
        let parentDivId = "";
        const activeClass = (isPrimary) ? "is-active" : "";

        switch (sectionLayout) {
            case `tabbable`:
                parentDivId = section.id + `__target`;
                const tabBodyAttributes = {
                    class: `mdl-tabs__panel ${activeClass}`,
                    id: `${parentDivId}`
                };
                utils.createAndAppendElement(`div`, tabBodyAttributes, `tab_group`);
                break;
            case `collapsible`:
            default:
                parentDivId = section.id + `__body`;
                const sectionBodyAttributes = {
                    class: `section_body`,
                    id: `${parentDivId}`
                };
                utils.createAndAppendElement(`div`, sectionBodyAttributes, section.id);
        };

        Object.values(section.rows).forEach((row) => {
            const rowAttributes = {
                id: `${row.row_id}`,
                class: `mdl-grid secton_row`
            };
            const isRowAppended = utils.createAndAppendElement(`div`, rowAttributes, parentDivId);
            if (!isRowAppended) throw new Error(`Please check schema for id: ${row.row_id}`);

            Object.values(row.cols).forEach((col) => {
                const col_id = row.row_id + `_` + col.field.id;
                const colAttributes = {
                    class: (col.field.fieldType != "hidden") ? `mdl-cell mdl-cell--${col.colSpan}-col mdl-cell--${col.colOffset}-offset` : "",
                    id: `${col_id}`
                };
                const isColumnAppended = utils.createAndAppendElement(`div`, colAttributes, row.row_id);
                if (!isColumnAppended) throw new Error(`Please check schema for id: ${col_id}`);

                if (col.field) genFields.generateFields(col, col_id, css);
                if (col.helperLink) genFields.createHelperLink(col.helperLink, col_id);
            });
        });
    } catch (error) {
        LOG.error(error);
        return false;
    }
    return true;
};

/**
 * Adds a collapsible controller to toggle the collapsible section in the form.
 * 
 * @param {String} sectionId - Id of the section for which the collapsible controller needs to be added
 */
const addCollapsibleController = (sectionId) => {
    const toggleAttributes = {
        class: `material-icons`,
        id: `${sectionId}__head__toggle`,
        style: `float: right; padding-right: 0.64em;`
    };
    utils.createAndAppendElement(`i`, toggleAttributes, `${sectionId}__header`);

    const toggleActionAttributes = {
        id: `${sectionId}__head__toggle_action`
    };
    utils.createAndAppendElement(`a`, toggleActionAttributes, toggleAttributes.id, `remove_circle_outline`);

    const bindingParentElementBackup = AUTOFORM_CONSTANTS.BINDING_PARENT_ELEMENT;

    AUTOFORM_CONSTANTS.BINDING_PARENT_ELEMENT.querySelector(`#${toggleActionAttributes.id}`).addEventListener("click", (event) => {

        const targetDiv = bindingParentElementBackup.querySelector(`#${sectionId}__body`);
        const iconElement = bindingParentElementBackup.querySelector(`#${sectionId}__head__toggle_action`);

        switch (iconElement.innerHTML) {
            case `add_circle_outline`:
                targetDiv.style.display = `block`;
                iconElement.innerHTML = `remove_circle_outline`;
                break;
            case `remove_circle_outline`:
            default:
                targetDiv.style.display = `none`;
                iconElement.innerHTML = `add_circle_outline`;
        };
    });
};

/**
 * Creates the wrapper for placing the form Submit button.
 * 
 * @param {Object} submitObject - Submit Object from Schema
 * @param {String} formId - Id of the generated form element
 */
const createSubmitGrid = (submitObject, formId) => {
    const divAttributes = {
        id: `button__grid`,
        class: `mdl-grid`
    };
    utils.createAndAppendElement(`div`, divAttributes, formId);

    if (submitObject.helperLink) {
        const href = utils.checkStringDeclaration(submitObject.helperLink.href) ? submitObject.helperLink.href : AUTOFORM_CONSTANTS.helperLink.href;
        const onclick = utils.checkStringDeclaration(submitObject.helperLink.onclick) ? submitObject.helperLink.onclick : AUTOFORM_CONSTANTS.helperLink.onclick;
        const name = utils.checkStringDeclaration(submitObject.helperLink.name) ? submitObject.helperLink.name : AUTOFORM_CONSTANTS.helperLink.name;
        const anchorAttributes = {
            href: `${href}`,
            onclick: `${onclick}`
        };
        utils.createAndAppendElement(`a`, anchorAttributes, `button__grid`, name);
    }

    const spacerAttributes = { class: `mdl-layout-spacer` };
    utils.createAndAppendElement(`div`, spacerAttributes, `button__grid`);

    const isCancelable = (submitObject.isCancelable) ? submitObject.isCancelable : false;
    if (isCancelable) {
        const cancelButtonAction = `location.reload();`;
        const cancelButtonClass = `mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect`;
        const cancelButtonAttributes = {
            id: AUTOFORM_CONSTANTS.cancelField.id,
            class: `${cancelButtonClass} autoform-button`,
            onclick: `${cancelButtonAction}`,
            type: `reset`,
            value: `CANCEL`,
            style: `margin-right: 40px;`
        };
        utils.createAndAppendElement(`input`, cancelButtonAttributes, `button__grid`, AUTOFORM_CONSTANTS.cancelField.name);
    }

    const submitId = utils.checkStringDeclaration(submitObject.id) ? submitObject.id.trim() : AUTOFORM_CONSTANTS.submitButton.id;
    const submitName = utils.checkStringDeclaration(submitObject.name) ? submitObject.name : AUTOFORM_CONSTANTS.submitButton.name;
    const buttonAttributes = {
        id: `${submitId}`,
        class: `mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent autoform-button`,
        style: `color: #ffffff`
    };
    utils.createAndAppendElement(`button`, buttonAttributes, `button__grid`, submitName);
};