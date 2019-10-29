/* 
 * (C) 2015 TekMonks. All rights reserved.
 * License: MIT - see enclosed license.txt file.
 */
const FRONTEND = "http://localhost:3030";
const BACKEND = "http://localhost:9000";
const APP_PATH = `${FRONTEND}/apps/login-registration-form`;
const APP_PREFIX = "apps/demoApp";

export const APP_CONSTANTS = {
    FRONTEND,
    BACKEND,
    APP_PATH,

    SESSION_NOTE_ID: "com_monkshu_ts",

    REGISTER_THTML: APP_PATH + "/register.html",
    LOGIN_THTML: APP_PATH + "/login.html",
    GETDETAILS_THTML: APP_PATH + "/get-details.html",
    UPDATE_THTML: APP_PATH + "/update.html",

    API_LOGIN: BACKEND + "/apps/login-registration-form/users/login",
    API_REGISTER: BACKEND + "/apps/login-registration-form/users/register",
    API_UPDATE: BACKEND + "/apps/login-registration-form/users/update",
    API_GETDETAILS: BACKEND + "/apps/login-registration-form/users/get-details",
    API_DELETE: BACKEND + "/apps/login-registration-form/users/delete",

    USERID: "id",
    GUEST_ROLE: "guest",
    PERMISSIONS_MAP: {
        guest: [
            $$.MONKSHU_CONSTANTS.ERROR_THTML,
            APP_PATH + "/register.html",
            APP_PATH + "/login.html",
            APP_PATH + "/get-details.html",
            APP_PATH + "/update.html"
        ]
    }
}