/*
creatOrga
readOrga
readTypeOrga
ADMIN
acceptOrga
disableUser
enableUser
acceptAdmin
acceptRecruteur
*/

var db = require('./db.js'); //pour la connexion

module.exports = {
    creatOrga: function (Nom, Siren, Type, SiegeSocial, callback) {
        var sql = mysql.format("INSERT INTO ORGANISATION VALUES (?, ?, ?, ?)", [Nom,Siren,Type,SiegeSocial]);
        db.query(sql, function (err, results) {
            if (err) throw err;
            callback(results);
        });
        callback(false);
    },

    readOrga: function ( callback) { 
        sql = "SELECT * FROM ORGANISATION";
        rows = db.query(sql, function (err, results) {
            if (err) throw err;
            if (rows.length != 0) { // si il y a au moins une ligne (donc une orga du type)
                callback(results)
            } else { // il n'y a pas d'orga de ce type
                callback(false);
            }
            //callback(results);
        });
    },
    readTypeOrga: function(nom, siren, callback){ // trouver une orga par son nom 
        sql = "SELECT Nom, Type FROM ORGANISATION WHERE Nom=? AND Siren=?";
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

