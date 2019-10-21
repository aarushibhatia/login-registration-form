import { utils } from "./helpers/utils.mjs";
import { rules } from "./../formRuleDefinitions.mjs"

/**
 * Add listeners for custom rules.
 * Events supported: onInputFocus ans onLostFocus
 * 
 * @param {Object} formRules - Object containing custom rules for different fields in a form
 */
const addRules = (containerDivElement, formRules) => {
    try {
        for (let elementId in formRules) {
            let element = containerDivElement.querySelector(`#${elementId}`);
            if (!element) throw new Error(`Rule element not found for id: '${elementId}'`);

            const ruleBlock = formRules[elementId];
            const errorMessage = utils.checkStringDeclaration(ruleBlock.errorMessage) ? ruleBlock.errorMessage : element.parentElement.lastChild.innerHTML;

            if (utils.checkStringDeclaration(ruleBlock.onInputFocus)) element.addEventListener("focusin", function (event) {
                let jsRule = ruleBlock.onInputFocus;
                executeRule(element, jsRule, errorMessage);
            });
            if (utils.checkStringDeclaration(ruleBlock.onLostFocus)) element.addEventListener("focusout", function (event) {
                let jsRule = ruleBlock.onLostFocus;
                executeRule(element, jsRule, errorMessage);
            });

            // For custom hover events
            if (utils.checkStringDeclaration(ruleBlock.onHoverIn)) element.addEventListener("onmouseover", function (event) { });
            if (utils.checkStringDeclaration(ruleBlock.onHoverOut)) element.addEventListener("onmouseout", function (event) { });
        };
    } catch (error) {
        LOG.error(error);
    }
};

/**
 * Executes the custom rule when the registered event is triggered
 * 
 * @param {HTMLElement} element - Reference of the HTML Element the rule is applied to 
 * @param {String} jsRule - Value of the rule definition; either a function name or inline JS enclosed inside js()
 * @param {String} errorMessage - Custom error message to display in case the validation fails
 */
const executeRule = (element, jsRule, errorMessage) => {
    try {
        const jsCode = getJSCode(jsRule);
        const response = eval(jsCode);
        if (!response) return;

        const result = response.result;
        const message = utils.checkStringDeclaration(response.message) ? response.message : errorMessage;
        element.parentElement.lastChild.innerHTML = message;

        if (!result) { element.parentElement.classList.add("is-invalid"); return; }

        if (element.parentElement.className.includes("is-invalid")) element.parentElement.classList.remove("is-invalid");

        return;
    } catch (error) {
        LOG.error(error);
    }
};

/**
 * Gets an executable code string that can be executed using eval() method.
 * 
 * @param {String} jsRule - Value of the rule definition; either a function name or inline JS enclosed inside js()
 * @returns {String}
 */
const getJSCode = (jsRule) => (jsRule.substring(0, 3) == "js(" && jsRule[jsRule.length - 1] == ")") ? jsRule.substring(3, jsRule.length - 1) : `rules.${jsRule}`;


/**
 * Export for formValidator.mjs
 */
export const validator = { addRules };