import { LIB_CONSTANTS } from "./conf/constants.mjs";
import { utils } from "./src/helpers/utils.mjs";

import { formSetup } from "./src/formSetup.mjs";
import { mapper } from "./src/formToJSONMapper.mjs";

if (!window.AUTOFORM_CONSTANTS) window.AUTOFORM_CONSTANTS = LIB_CONSTANTS;

export const autoforms = {
    setupForm: formSetup,
    mapFormToJSON: mapper.init,
    utils
};