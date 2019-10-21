import { generateForm } from "./formGenerator.mjs";
import { validator } from "./formValidator.mjs";
import { utils } from "./helpers/utils.mjs";

/**
 * Generates the form and applies custom validations if any
 * 
 * @param {Object} config - Configuration for the form to be setup
 * @param {HTMLDivElement} config.bindingDivElement - querySelector reference of the HTML Div that the form needs to be placed inside
 * @param {String} config.schemaPath - Path of the JSON File where the corresponding form schema definition is stored
 * @returns {Boolean}
 */
export const formSetup = async (config, isPartial = false) => {
    try {
        if (!config || !config.bindingDivElement || !config.schemaPath) throw new Error("Invalid Configuration.");

        AUTOFORM_CONSTANTS.BINDING_PARENT_ELEMENT = config.bindingDivElement;

        utils.initFormLoader(config.bindingDivElement);

        // Cache Form Generator Schema JSON
        const formSchema = await $$.requireJSON(`${config.schemaPath}`);
        await generateForm(config.bindingDivElement, formSchema, isPartial);

        const formCSS = utils.checkStringDeclaration(formSchema.css) ? formSchema.css : AUTOFORM_CONSTANTS.css;
        if (formCSS == "mdl") $$.ready(() => utils.upgradeMDL());

        // Cache Form Validator Schema JSON
        const validatorSchema = await $$.requireJSON(APP_CONSTANTS.VALIDATION_RULES_PATH);

        const formId = utils.checkStringDeclaration(formSchema.form_id) ? formSchema.form_id : AUTOFORM_CONSTANTS.formId;
        if (validatorSchema[formId]) validator.addRules(config.bindingDivElement, validatorSchema[formId]);

        utils.hideFormLoader(config.bindingDivElement);

        delete AUTOFORM_CONSTANTS.BINDING_PARENT_ELEMENT;
        return true;

    } catch (error) {
        LOG.error(error);
        if (AUTOFORM_CONSTANTS.BINDING_PARENT_ELEMENT) delete AUTOFORM_CONSTANTS.BINDING_PARENT_ELEMENT;
        return false;
    }
};