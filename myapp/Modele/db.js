var mysql = require('mysql');


var pool = mysql.createPool({
host: "tuxa.sme.utc", //ou localhost
user: "sr10p010",
password: "HvpYy3hHvke9",
database: "sr10p010"
});

/*connection.connect(function(err) {
    if (err) throw err;
});*/

// obtenir une connexion à partir du pool de connexions
/*pool.getConnection(function(err, connection) {
    if (err) {
      throw err;
    } else {
      console.log("Connexion établie avec succès à la base de données MySQL !");
    }
  });*/

module.exports = pool;