/**
 * Custom formatting rules for different datatypes
 */
export const formatRules = {
    text: {
        regEx: "^[a-zA-Z0-9_,. \-\s]*$"
    },
    numeric: {
        regEx: "-?[0-9]*(\.[0-9]+)?"
    },
    tel: {
        regEx: "^(\([0-9]{3}\))\s([0-9]{3})-([0-9]{4})$",
        mask: "(999) 999-9999"
    },
    zip: {
        regEx: "^([0-9]{5})-([0-9]{4})$",
        mask: "99999?-9999"
    },
    date: {
        regEx: /(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d/,
        mask: "99/99/9999",
        placeholder: "mm/dd/yyyy"
    }
};