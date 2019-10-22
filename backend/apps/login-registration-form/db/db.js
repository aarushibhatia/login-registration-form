let mysql = require('./../3p/node_modules/mysql');

exports.connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Aarushi1!',
    database: 'demoAppdb'
});