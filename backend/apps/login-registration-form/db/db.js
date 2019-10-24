const mysql = require("./../3p/node_modules/mysql");
const dbConfig = require("../db/db.conf.json");

exports.getConnection = () => mysql.createConnection(dbConfig);