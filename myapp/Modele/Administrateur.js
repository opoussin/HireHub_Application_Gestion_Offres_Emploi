var db = require('./db.js');
module.exports = {
    readAll: function (callback) {
        db.query("select * from Utilisateur", function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    acceptOrga: function (nom, siren, type, siege_social, callback) {
        sql = "SELECT Siren FROM USERS WHERE siren = ?";
        rows = db.query(sql, email, function (err, results) {
            if (err) throw err;
            if (rows.length == 1 ) {
                callback(false)
            } else {
                var sql2 = mysql.format("INSERT INTO UTILISATEUR VALUES (?,?,?,?)", [nom, siren, type, siege_social]);
                db.query(sql2, function (err, result) {
                if (err) throw err;
                callback(results);
            });
            }
        });
    },
    desactiverCompte: function (callback) {
        var sql = mysql.format("UPDATE UTILISATEUR SET Etat=False WHERE Mail=?");

        db.query(sql, function (err, result) {
                if (err) throw err;
                callback(results);
            });
        callback(false);
    },
    activerCompte: function (callback) {
        var sql = mysql.format("UPDATE UTILISATEUR SET Etat=True WHERE Mail=?");

        db.query(sql, function (err, result) {
                if (err) throw err;
                callback(results);
            });
        callback(false);
    },
    acceptAdmin: function (callback) {
        var sql = mysql.format("UPDATE UTILISATEUR SET Type=3 WHERE Mail=?");

        db.query(sql, function (err, result) {
                if (err) throw err;
                callback(results);
            });
        callback(false);
    },

}