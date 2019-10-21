/* 
 * (C) 2015 TekMonks. All rights reserved.
 * License: MIT - see enclosed license.txt file.
 */
const FRONTEND = "http://localhost:3030";
const BACKEND = "http://localhost:9000";
const APP_PATH = `${FRONTEND}/apps/demoApp`;
const APP_PREFIX = "apps/demoApp";

export const APP_CONSTANTS = {
    FRONTEND,
    BACKEND,
    APP_PATH,

    SESSION_NOTE_ID: "com_monkshu_ts",

    MAIN_THTML: APP_PATH + "/main.html",
    LOGIN_THTML: APP_PATH + "/login.html",
    LIST_THTML: APP_PATH + "/list.html",
    EDIT_THTML: APP_PATH + "/edit.html",

    API_LOGIN: BACKEND + "/apps/demoApp/login",
    API_REGISTER: BACKEND + "/apps/demoApp/register",
    API_DISPLAY: BACKEND + "/apps/demoApp/display-registered-users",
    API_UPDATE: BACKEND + "/apps/demoApp/update",
    API_GETDETAILS: BACKEND + "/apps/demoApp/get-details",

    USERID: "id",
    GUEST_ROLE: "guest",
    PERMISSIONS_MAP: {
        guest: [$$.MONKSHU_CONSTANTS.ERROR_THTML,
                APP_PATH + "/main.html",
                APP_PATH + "/login.html",
                APP_PATH + "/list.html",
                APP_PATH + "/edit.html"
                ]
    }
}