import { formatRules } from './../../conf/formatRules.mjs';
import { utils } from "./utils.mjs";

function init(format, parentElementId) {
    if (!format || !parentElementId) return false;

    let parentElement = AUTOFORM_CONSTANTS.BINDING_PARENT_ELEMENT.querySelector(`#${parentElementId}`);
    if (!parentElement) return false;

    switch (format) {
        case "date":
            formatDateInput(parentElement);
            break;
        case "tel":
            formatTelInput(parentElement);
            break;
        case "zip":
            formatZipInput(parentElement);
            break;
    };

    return true;
};

async function formatDateInput(parentElement) {
    let dateInputElement = parentElement.querySelector("input._generatedDateInput_");
    if (!dateInputElement) return;

    dateInputElement.onchange = function (event) {
        if (this.value != "" && !isNaN(Date.parse(this.value))) {
            this.parentElement.classList.add("is-dirty");
        } else {
            this.value = "";
            this.parentElement.classList.remove("is-dirty");
        }
        return;
    };

    $(`#${dateInputElement.id}`).mask(formatRules.date.mask, { placeholder: `${formatRules.date.placeholder}` });

    dateInputElement.onblur = function (event) {
        const insertedValue = this.value;

        if (!isNaN(Date.parse(insertedValue))) {
            const readableDate = utils.timestampToReadableDate(Date.parse(insertedValue));

            if (insertedValue != readableDate) {
                this.value = "";
                this.parentElement.classList.remove("is-dirty");
            }
        }

        if (this.value != "" && !isNaN(Date.parse(insertedValue))) this.parentElement.classList.remove("is-invalid");
        return;
    };

    return;
};

async function formatTelInput(parentElement) {
    let telInputElement = parentElement.querySelector("._generatedTelInput_");
    if (!telInputElement) return;

    telInputElement.onchange = function (event) {
        if (this.value != '') telInputElement.parentElement.classList.add("is-dirty");
        else telInputElement.parentElement.classList.remove("is-dirty");
        return;
    };

    $(`#${telInputElement.id}`).mask(formatRules.tel.mask);

    telInputElement.onblur = function (event) {
        if (this.value != "") this.parentElement.classList.remove("is-invalid");
        return;
    };

    return;
};

async function formatZipInput(parentElement) {
    let zipInputElement = parentElement.querySelector("._generatedZipInput_");
    if (!zipInputElement) return;

    zipInputElement.onchange = function (event) {
        if (this.value != '') zipInputElement.parentElement.classList.add("is-dirty");
        else zipInputElement.parentElement.classList.remove("is-dirty");
        return;
    };

    $(`#${zipInputElement.id}`).mask(formatRules.zip.mask);

    zipInputElement.onblur = function (event) {
        if (this.value != "") this.parentElement.classList.remove("is-invalid");
        return;
    };

    return;
};

/**
 * Export for formatInputs.mjs.
 * Does initialization of fileds that require custom formatting
 */
export const formatInputs = { init };