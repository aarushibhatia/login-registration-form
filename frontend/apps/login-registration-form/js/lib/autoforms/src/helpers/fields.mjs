import { utils } from "./utils.mjs";
import { formatRules } from './../../conf/formatRules.mjs';
import { formatInputs } from "./formatInputs.mjs";

/**
 * Generate Fields for different columns
 * 
 * @param {object} col - Column Object From Rows <- Section <- Schema
 * @param {string} col_id - Modified column id
 * @param {string} css 
 * @returns {boolean}
 */
async function generateFields(col, col_id, css) {
    let label = col.label;
    let field = col.field;

    field.fieldType = (field.fieldType) ? field.fieldType : AUTOFORM_CONSTANTS.field.fieldType;
    field.isRequired = (field.isRequired) ? field.isRequired : AUTOFORM_CONSTANTS.field.isRequired;
    if (field.isRequired) label = label + ` *`;

    let newDivId = `element__` + col_id;
    switch (field.fieldType) {
        case "textfield":
            createTextField(col_id, newDivId, field, label, css);
            break;
        case "textarea":
            createTextArea(col_id, newDivId, field, label, css);
            break;
        case "binaryselect":
            createSelectorFieldContainer(col_id, newDivId, `${field.id}__label-div`, label, css);
            createBinarySelectFields(newDivId, field, css);
            break;
        case "multiselect":
            createSelectorFieldContainer(col_id, newDivId, `${field.id}__label-div`, label, css);
            createMultiSelectFields(newDivId, field, css);
            break;
        case "dropdown":
            createDropDownContainer(col_id, newDivId, field, label, css);
            createListElements(`${field.id}__list`, field, css);
            break;
        case "tabular":
            createTabularFields(col_id, newDivId, field, label, css);
            break;
        case "hidden":
            createHiddenField(col_id, newDivId, field);
            break;
        default:
            LOG.error(`Field type ${field.fieldType} not supported. \nRefer to field id: "${field.id}" in schema.`);
            return false;
    };
    return true;
};

/**
 * Creates a TextField input element with specified datatype
 * 
 * @param {string} col_id - Modified column id
 * @param {string} newDivId - Id of the new enclosing div
 * @param {object} field - Field Object from Column Definition
 * @param {string} label - TextField label
 * @param {string} css 
 */
function createTextField(col_id, newDivId, field, label, css) {
    let divAttributes = {
        id: `${newDivId}`,
        class: `${css}-textfield ${css}-js-textfield ${css}-textfield--floating-label`,
        style: `width: 100%;`
    };
    utils.createAndAppendElement(`div`, divAttributes, col_id);

    let requiredClassname = (field.isRequired) ? "required" : "";
    let inputAttributes = {
        class: `${css}-textfield__input ${requiredClassname}`,
        type: `${field.dataType}`,
        id: `${field.id}`
    };
    inputAttributes.maxlength = utils.checkStringDeclaration(field.maxLength) ? field.maxLength : AUTOFORM_CONSTANTS.textField.maxLength;
    inputAttributes.name = utils.checkStringDeclaration(field.name) ? field.name : field.id;

    if (field.readOnly) inputAttributes.readonly = ``;

    // Implementing pattern validation for all regular textfields [dataType=text]
    if (field.dataType == "text") inputAttributes.pattern = utils.checkStringDeclaration(field.pattern) ? field.pattern : formatRules.text.regEx;

    let format;

    // Check for non-generic datatypes
    if (!AUTOFORM_CONSTANTS.field.genericDataTypesList.includes(inputAttributes.type))
        switch (inputAttributes.type) {
            case "numeric":
                inputAttributes.type = "text";
                inputAttributes.pattern = formatRules.numeric.regEx;
                break;
            case "date":
                format = "date";
                inputAttributes.type = "text";
                inputAttributes.class += " _generatedDateInput_";
                let pattern = formatRules.date.regEx.toString();
                pattern = pattern.substr(1, pattern.length - 2);
                inputAttributes.pattern = pattern;
                break;
            case "tel":
                format = "tel";
                inputAttributes.class += " _generatedTelInput_";
                break;
            case "zip":
                format = "zip";
                inputAttributes.class += " _generatedZipInput_";
                break;
            default:
                format = false;
                LOG.error(`DataType ${inputAttributes.type} not supported. \nConverting field with id "${inputAttributes.id}" to ${AUTOFORM_CONSTANTS.field.dataType}`);
                inputAttributes.type = AUTOFORM_CONSTANTS.field.dataType;
        };
    utils.createAndAppendElement(`input`, inputAttributes, newDivId);

    let labelAttributes = {
        class: `${css}-textfield__label`,
        for: `${field.id}`
    };
    utils.createAndAppendElement(`label`, labelAttributes, newDivId, label);

    if (utils.checkStringDeclaration(field.tooltip)) createTooltip(newDivId, field.id, field.tooltip);

    let spanAttributes = { class: `mdl-textfield__error` };
    let errorMessage = utils.checkStringDeclaration(field.errorMessage) ? field.errorMessage : AUTOFORM_CONSTANTS.textField.errorMessage;
    utils.createAndAppendElement(`span`, spanAttributes, newDivId, errorMessage);

    if (format) formatInputs.init(format, newDivId);

    return;
};

/**
 * Creates a TextArea element with specified row span
 * 
 * @param {string} col_id - Modified column id
 * @param {string} newDivId - Id of the new enclosing div
 * @param {object} field - Field Object from Column Definition
 * @param {string} label - TextArea label
 * @param {string} css 
 */
function createTextArea(col_id, newDivId, field, label, css) {
    let divAttributes = {
        id: `${newDivId}`,
        class: `${css}-textfield ${css}-js-textfield ${css}-textfield--floating-label`,
        style: `width: 100%;`
    };
    utils.createAndAppendElement(`div`, divAttributes, col_id);

    let requiredClassname = (field.isRequired) ? "required" : "";
    let rows = utils.checkStringDeclaration(field.rows) ? field.rows.trim() : AUTOFORM_CONSTANTS.textArea.rowCount;
    let textAreaAttributes = {
        class: `${css}-textfield__input ${requiredClassname}`,
        type: `${field.dataType}`,
        rows: `${rows}`,
        id: `${field.id}`
    };
    textAreaAttributes.maxlength = utils.checkStringDeclaration(field.maxLength) ? field.maxLength : AUTOFORM_CONSTANTS.textArea.maxLength;
    textAreaAttributes.name = utils.checkStringDeclaration(field.name) ? field.name : field.id;

    if (field.readOnly) textAreaAttributes.readonly = ``;

    utils.createAndAppendElement(`textarea`, textAreaAttributes, newDivId);

    let labelAttributes = {
        class: `${css}-textfield__label`,
        for: `${field.id}`
    };
    utils.createAndAppendElement(`label`, labelAttributes, newDivId, label);

    if (utils.checkStringDeclaration(field.tooltip)) createTooltip(newDivId, field.id, field.tooltip);

    let spanAttributes = { class: `mdl-textfield__error` };
    let errorMessage = utils.checkStringDeclaration(field.errorMessage) ? field.errorMessage : AUTOFORM_CONSTANTS.textArea.errorMessage;
    utils.createAndAppendElement(`span`, spanAttributes, newDivId, errorMessage);

    return;
};

/**
 * Creates a division to enclose Selector Fields
 * 
 * @param {string} col_id - Modified column id
 * @param {string} newDivId - Id of the new enclosing div
 * @param {object} field - Field Object from Column Definition
 * @param {string} label - Selectable fields' label
 * @param {string} css 
 */
function createSelectorFieldContainer(col_id, newDivId, labelId, label, css) {
    let divAttributes = {
        id: `${newDivId}`,
        class: `mdl-grid`,
        style: `width: 100%;`
    };
    utils.createAndAppendElement(`div`, divAttributes, col_id);

    divAttributes = {
        id: labelId,
        class: `choiceLabel mdl-cell mdl-cell--12-col`
    };
    utils.createAndAppendElement(`div`, divAttributes, newDivId, label);

    return;
};

/**
 * Create BinarySelect Fields - Radio Inputs
 * 
 * @param {string} newDivId - Id of the enclosing div
 * @param {object} field - Field Object from Column Definition
 * @param {string} css 
 */
function createBinarySelectFields(newDivId, field, css) {
    let requiredClassname = (field.isRequired) ? "required" : "";
    const fieldSpan = utils.checkStringDeclaration(field.span) ? field.span : AUTOFORM_CONSTANTS.binarySelect.fieldSpan;
    Object.values(field.options).map(function (option) {
        let divAttributes = {
            class: `mdl-cell mdl-cell--${fieldSpan}-col`,
            id: `${field.id}_${option.id}`
        };
        utils.createAndAppendElement(`div`, divAttributes, newDivId);

        let labelAttributes = {
            class: `mdl-radio mdl-js-radio mdl-js-ripple-effect`,
            for: `${option.id}`,
            id: `label_${option.id}`
        };
        utils.createAndAppendElement(`label`, labelAttributes, divAttributes.id);

        let inputAttributes = {
            class: `mdl-radio__button ${requiredClassname}`,
            type: `radio`,
            id: `${option.id}`,
            name: `${field.id}`,
            value: `${option.value}`
        };
        utils.createAndAppendElement(`input`, inputAttributes, labelAttributes.id);

        let spanAttributes = { class: `mdl-radio__label` };
        utils.createAndAppendElement(`span`, spanAttributes, labelAttributes.id, option.label);
    });
    return;
};

/**
 * Create MultiSelect Fields - CheckBox Inputs
 * 
 * @param {string} newDivId - Id of the enclosing div
 * @param {object} field - Field Object from Column Definition
 * @param {string} css 
 */
function createMultiSelectFields(newDivId, field, css) {
    const fieldSpan = utils.checkStringDeclaration(field.span) ? field.span : AUTOFORM_CONSTANTS.multiSelect.fieldSpan;
    Object.values(field.options).map(function (option) {
        let divAttributes = {
            class: `mdl-cell mdl-cell--${fieldSpan}-col`,
            id: `${field.id}_${option.id}`
        };
        utils.createAndAppendElement(`div`, divAttributes, newDivId);

        let labelAttributes = {
            class: `mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect`,
            for: `${option.id}`,
            id: `label_${option.id}`
        };
        utils.createAndAppendElement(`label`, labelAttributes, divAttributes.id);

        let inputAttributes = {
            class: `mdl-checkbox__input`,
            type: `checkbox`,
            id: `${option.id}`,
            value: `${option.value}`,
            name: `${field.id}`
        };
        utils.createAndAppendElement(`input`, inputAttributes, labelAttributes.id);

        let spanAttributes = { class: `mdl-checkbox__label` };
        utils.createAndAppendElement(`span`, spanAttributes, labelAttributes.id, option.label);
    });
    return;
};

/**
 * Creates a ToolTip
 * 
 * @param {string} appendToId - Id of the enclosing element
 * @param {string} targetId - Id of the target element
 * @param {string} tooltipContent - Message to be displayed in the tool-tip
 */
function createTooltip(appendToId, targetId, tooltipContent) {
    let divAttributes = {
        class: `mdl-tooltip`,
        for: `${targetId}`
    };
    utils.createAndAppendElement(`div`, divAttributes, appendToId, tooltipContent);
    return;
};

/**
 * Creates the dropdown input and a division to enclose option list
 * 
 * @param {string} col_id - Modified column id
 * @param {string} newDivId - Id of the new enclosing div
 * @param {object} field - Field Object from Column Definition
 * @param {string} label - DropDown fields' label
 * @param {string} css 
 */
function createDropDownContainer(col_id, newDivId, field, label, css) {
    let divAttributes = {
        id: `${newDivId}`,
        class: `${css}-textfield ${css}-js-textfield ${css}-textfield--floating-label getmdl-select getmdl-select__fix-height`,
        style: `width: 100%;`
    };
    utils.createAndAppendElement(`div`, divAttributes, col_id);

    let requiredClassname = (field.isRequired) ? "required" : "";
    let inputAttributes = {
        class: `${css}-textfield__input ${requiredClassname}`,
        type: `${field.dataType}`,
        value: ``,
        id: `${field.id}`,
        readonly: ``
    };
    utils.createAndAppendElement(`input`, inputAttributes, newDivId);

    let hiddenInputAttributes = {
        type: `hidden`,
        value: ``,
        name: `${field.id}`
    };
    utils.createAndAppendElement(`input`, hiddenInputAttributes, newDivId);

    let iconElementAttributes = {
        class: `mdl-icon-toggle__label material-icons`
    };
    utils.createAndAppendElement(`i`, iconElementAttributes, newDivId, `keyboard_arrow_down`);

    let labelAttributes = {
        class: `${css}-textfield__label`,
        for: `${field.id}`
    };
    utils.createAndAppendElement(`label`, labelAttributes, newDivId, label);

    let listAttributes = {
        for: `${field.id}`,
        class: `mdl-menu mdl-menu--bottom-left mdl-js-menu`,
        id: `${field.id}__list`
    };
    utils.createAndAppendElement(`ul`, listAttributes, newDivId);

    return;
};

/**
 * Creates the option list for the dropdown menu
 * 
 * @param {string} listId - Id of the parent list element
 * @param {object} field - Field Object from Column Definition
 * @param {string} css 
 */
function createListElements(listId, field, css) {
    Object.values(field.options).map(function (option) {
        let listElementAttributes = {
            class: `mdl-menu__item`,
            id: `${option.id}`,
            "data-val": `${option.value}`
        };
        if (option.isSelected) listElementAttributes["data-selected"] = true;
        utils.createAndAppendElement(`li`, listElementAttributes, listId, option.label);
    });
    return;
};

/**
 * Creates a Table of Input Fields
 * 
 * @param {string} col_id - Modified column id
 * @param {string} newDivId - Id of the new enclosing div
 * @param {object} field - Field Object from Column Definition
 * @param {string} css 
 */
function createTabularFields(col_id, newDivId, field, label, css) {
    let tableId = field.id;
    let tableSchema = field.tableSchema;

    let divAttributes = {
        id: `${newDivId}`,
        class: ``,
        style: `width: 100%;`
    };
    utils.createAndAppendElement(`div`, divAttributes, col_id);

    let tableAttributes = {
        id: `${tableId}`,
        class: ``,
        style: `width: 100%;`
    };
    utils.createAndAppendElement(`table`, tableAttributes, newDivId);

    Object.values(tableSchema).map(function (tableRow) {
        let tableRowId = tableRow.id;
        let tableRowAttributes = {
            id: `${tableRowId}`
        };
        utils.createAndAppendElement(`tr`, tableRowAttributes, tableId);

        let cells = tableRow.cells;
        Object.values(cells).map(function (cell) {
            let cellId = cell.id;
            let isHeader = (cell.isHeader != null) ? cell.isHeader : false;
            let tag = (isHeader) ? "th" : "td";
            let tagId = cellId + "_tag";
            let tagLabel = utils.checkStringDeclaration(cell.label) ? cell.label : "";

            let tagElementAttributes = {
                id: `${tagId}`
            }
            tagElementAttributes.colspan = utils.checkStringDeclaration(cell.colSpan) ? cell.colSpan : "1";
            utils.createAndAppendElement(tag, tagElementAttributes, tableRowId);

            if (tag == "td") {
                let divId = "cell_element__" + cellId;
                let field = {
                    id: `${cellId}`,
                    dataType: `text`
                }
                field.name = utils.checkStringDeclaration(cell.name) ? cell.name : cellId;
                createTextField(tagId, divId, field, tagLabel, css);
            } else {
                AUTOFORM_CONSTANTS.BINDING_PARENT_ELEMENT.querySelector(`#${tagId}`).innerHTML = `<p>${tagLabel}</p>`;
            }
        });
    });
    AUTOFORM_CONSTANTS.BINDING_PARENT_ELEMENT.querySelector(`#${tableId}`).firstChild.firstChild.firstChild.style = `font-weight: bold; font-size: 1.17em;`;
    return;
};

/**
 * Creates a hidden input readonly element
 * 
 * @param {string} col_id - Modified column id
 * @param {string} newDivId - Id of the new enclosing div
 * @param {object} field - Field Object from Column Definition
 */
const createHiddenField = (col_id, newDivId, field) => {
    const divAttributes = {
        id: `${newDivId}`,
        style: `display: none;`
    };
    utils.createAndAppendElement(`div`, divAttributes, col_id);

    const inputAttributes = {
        class: (field.isRequired) ? "required" : "",
        type: "hidden",
        id: `${field.id}`,
        readonly: ``
    };
    inputAttributes.maxlength = utils.checkStringDeclaration(field.maxLength) ? field.maxLength : AUTOFORM_CONSTANTS.textField.maxLength;
    inputAttributes.name = utils.checkStringDeclaration(field.name) ? field.name : field.id;
    utils.createAndAppendElement(`input`, inputAttributes, newDivId);
};

/**
 * Creates a helper link and places it in the form
 * 
 * @param {object} helperLink - HelperLink Object from Schema
 * @param {string} col_id - Modified column id
 */
function createHelperLink(helperLink, col_id) {

    let helperLinkDivId = `link__` + col_id;
    let divAttributes = {
        class: `mdl-grid`,
        id: `${helperLinkDivId}`
    };
    utils.createAndAppendElement(`div`, divAttributes, col_id);

    let spacerAttributes = { class: `mdl-layout-spacer` };
    utils.createAndAppendElement(`div`, spacerAttributes, helperLinkDivId);

    let href = utils.checkStringDeclaration(helperLink.href) ? helperLink.href : AUTOFORM_CONSTANTS.helperLink.href;
    let onclick = utils.checkStringDeclaration(helperLink.onclick) ? helperLink.onclick : AUTOFORM_CONSTANTS.helperLink.onclick;
    let name = utils.checkStringDeclaration(helperLink.name) ? helperLink.name : AUTOFORM_CONSTANTS.helperLink.name;
    let anchorAttributes = {
        href: `${href}`,
        onclick: `${onclick}`,
        class: `autoforms-helperlink`
    };
    utils.createAndAppendElement(`a`, anchorAttributes, helperLinkDivId, name);

};

/**
 * Export for fields.mjs
 */
export const genFields = { generateFields, createHelperLink };