const mysql = require('mysql2');

const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"MydognamedMax5!",
    database:"company"
});

module.exports = connection;