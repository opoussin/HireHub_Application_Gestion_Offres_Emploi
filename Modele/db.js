var mysql = require("mysql");
var pool = mysql.createPool({
host: "tuxa.sme.utc", //ou localhost
user: "sr10p010",
password: "HvpYy3hHvke9",
database: "sr10p010"
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = pool;