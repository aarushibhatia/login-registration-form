let mysql = require('./../3p/node_modules/mysql');
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Aarushi1!',
    database: 'demoAppdb'
});

const sampleQueries = {
    create: 'CREATE TABLE if not exists usersDB(username varchar(100) , fullName varchar(100),  password varchar(100))',
    readData: 'SELECT * from usersDB'
};


exports.populateData = (username, fullName, password) => {
    return new Promise(function (resolve, reject) {

        let sql = "select exists (select * from usersDB where username = ?) as userExists";

        connection.query(sql, [username], function (error, result) {
            if (error) {
                LOG.error(error);
                return reject(error);
            }
            else {
                if (result[0].userExists > 0) {
                    LOG.info("Username already exists!");
                    return resolve({ result: false });
                }
                else {
                    connection.query("INSERT INTO usersDB (username, fullName, password) VALUES(?, ? , ?)", [username, fullName, password], function (error, result) {
                        if (error) {
                            LOG.error(error);
                            return resolve({ result: false });
                        }
                        else {
                            LOG.info("Username added.");
                            return resolve({ result: true });
                        }
                    });
                }
            }
        });
    });
};


exports.updateData = (username, fullName, password) => {
    return new Promise(function (resolve, reject) {

        let sql = "select exists (select * from usersDB where username = ?) as userExists";

        connection.query(sql, [username], function (error, result) {
            if (error) {
                LOG.error(error);
                return reject(error);
            }
            else {
                if (result[0].userExists > 0) {
                    connection.query('delete from usersDB where username = ?', [username]);
                    connection.query("INSERT INTO usersDB (username, fullName, password) VALUES(?, ? , ?)", [username, fullName, password], function (error, result) {
                        if (error) {
                            LOG.error(error);
                            return resolve({ result: false });
                        }
                        else {
                            LOG.info("Updated.");
                            return resolve({ result: true });
                        }
                    });
                }
                else {
                    return resolve({ result: false });
                }
            }
        });
    });
};


exports.getDetails = (username) => {
    return new Promise(function (resolve, reject) {

        let sql = "select fullName, password from usersDB where username=?";

        connection.query(sql, [username], function (error, result) {
            if (error) {
                LOG.error(error);
                return reject(error);
            }
            else {
                            return resolve({ result: true, results : result  });
                        }
                    });
    });
};



exports.validateData = (username, password) => {
    return new Promise(function (resolve, reject) {


        let sql = "select exists (select * from usersDB where username = ? and password = ?) as validUser"


        connection.query(sql, [username, password], function (error, result) {
            if (error) {
                LOG.error(error);
                return reject(error);
            }
            else {
                if (result[0].validUser > 0) {
                    LOG.info("User logged in.");
                    return resolve({ result: true, message: "User logged in." });

                }
                else {
                    LOG.info("Invalid credentials.");
                    return resolve({ result: false, message: "Invalid credentials." });

                }
            }
        });
    });
}



exports.getTableData = () => {
    return new Promise(function (resolve, reject) {
        let sql = "select * from usersDB";

        connection.query(sql, function (error, result) {
            if (error) {
                LOG.error(error);
                return reject(error);
            }
            else {
                LOG.info(result);
                return resolve({ result: result, message: "true" });
            }
        });
    });


};

