/**
 * Default library constants
 */
export const LIB_CONSTANTS = {
    formId: "default-lib-form-id",
    autoCompleteStatus: "off",
    sectionLayout: "collapsible",
    css: "mdl",

    isPrimary: false,

    bypassIsRequiredClassName: "bypassField",

    field: {
        fieldType: "textfield",
        isRequired: false,
        dataType: "text",
        genericDataTypesList: ["text", "email", "password"],
        dataTypesList: ["text", "email", "password", "numeric", "date", "tel", "zip"]
    },

    textField: {
        maxLength: 128,
        errorMessage: "Invalid input!"
    },
    textArea: {
        rowCount: 3,
        maxLength: 256,
        errorMessage: "Invalid input!"
    },
    binarySelect: {
        fieldSpan: 4
    },
    multiSelect: {
        fieldSpan: 4
    },

    helperLink: {
        href: "javascript:void(0)",
        onclick: "javascript:void(0)",
        name: "Aarushi Bhatia"
    },

    submitButton: {
        id: "default-submit-button-id",
        name: "SUBMIT"
    },
    cancelField: {
        id: "default-cancel-button-id",
        name: "CANCEL"
    },
    loginButton: {
        id: "default-login-button-id",
        name: "LOGIN"
    }
};