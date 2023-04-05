var db = require('./db.js');

module.exports = {
    read: function (email, callback) { //utilisateur par email
        db.query("select * from Utilisateur where email= ?",email, function (err, results){
            if (err) throw err;
                callback(results);
        });
    },

    readall: function (callback) { // liste de tous les utilisateurs
        db.query("select * from Utilisateur", function (err, results) {
            if (err) throw err;
                callback(results);
        });
    },

    areValid: function (email, password, callback) { // mdp de l'utilisateur d'email donné
        sql = "SELECT pwd FROM USERS WHERE email = ?";
        rows = db.query(sql, email, function(err, results) {
            if (err) throw err;
            if (rows.length == 1 && rows[0].pwd=== password) {
                callback(true)
            } else {
                callback(false);
             }
        });
    },
}