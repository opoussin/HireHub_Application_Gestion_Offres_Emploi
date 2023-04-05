var db = require('./db.js'); //pour la connexion

module.exports = {
    creat: function (Nom, Siren, Type, SiegeSocial, callback) {
        var sql = mysql.format("INSERT INTO Organisation VALUES (?, ?, ?, ?)", [Nom,Siren,Type,SiegeSocial]);
        db.query(sql, function (err, result) {
            if (err) throw err;
            callback(results);
        });
        callback(false);
    },
    readOrga: function (type, callback) { // trouver une orga par son type
        sql = "SELECT Nom FROM Organisation WHERE Type = ?";
        rows = db.query(sql, type, function (err, results) {
            if (err) throw err;
            if (rows.length != 0) { // si il y a au moins une ligne (donc une orga du type)
                callback(true)
            } else { // il n'y a pas d'orga de ce type
                callback(false);
            }
        });
    },
    readType: function(nom, siren, callback){ // trouver une orga par son nom 
        sql = "SELECT Nom, Type FROM Organisation WHERE Nom=? AND Siren=?";
        rows = db.query(sql,[nom,siren], function (err, results) {
            if (err) throw err;
            if (rows.length != 0) { 
                callback(true)
            } else {
                callback(false);
            }
        });
    }
}

