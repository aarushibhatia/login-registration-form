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
    LIST_THTML: APP_PATH + "/list.html",
    EDIT_THTML: APP_PATH + "/edit.html",

    API_LOGIN: BACKEND + "/apps/login-registration-form/login",
    API_REGISTER: BACKEND + "/apps/login-registration-form/register",
    API_DISPLAY: BACKEND + "/apps/login-registration-form/display-registered-users",
    API_UPDATE: BACKEND + "/apps/login-registration-form/update",
    API_GETDETAILS: BACKEND + "/apps/login-registration-form/get-details",

    USERID: "id",
    GUEST_ROLE: "guest",
    PERMISSIONS_MAP: {
        guest: [
                $$.MONKSHU_CONSTANTS.ERROR_THTML,
                APP_PATH + "/register.html",
                APP_PATH + "/login.html",
                APP_PATH + "/list.html",
                APP_PATH + "/edit.html"
                ]
    }
}