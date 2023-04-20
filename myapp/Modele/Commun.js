/*COMMUN
areUserValid
creatUser
areRecruteur
areAdmin
readOrga
deleteUser
readUser
*/


var db = require('./db.js');
var mysql = require('mysql');


module.exports = {
    areUserValid: function (mail, mdp, callback) {
        sql = "SELECT mdp FROM UTILISATEUR WHERE mail = ?";
        db.query(sql, mail, function (err, rows) {
            if (err) throw err;
            if (rows.length == 1 && rows[0].mdp === mdp) {
                callback(true)
            } else {
                callback(false);
            }
        });
    },
    creatUser: function (mail, nom, prenom, mdp, telephone, callback) {
        var sql = mysql.format("INSERT INTO UTILISATEUR (mail, mdp, nom, prenom, telephone) VALUES (?,?,?,?,?)", [mail, mdp, nom, prenom, telephone]);

        db.query(sql, function (err, results) {
                callback(err!=undefined);
            });
    },
    areRecruteur: function (mail, callback) {
        sql = "SELECT Type FROM UTILISATEUR WHERE mail = ?";
        rows = db.query(sql, mail, function (err, results) {
            if (err) throw err;
            if (rows.length == 1 && rows[0].type === 2) {
                callback(true)
            } else {
                callback(false);
            }
        });
    },
    areAdmin: function (mail, callback) {
        sql = "SELECT Type FROM USERS WHERE mail = ?";
        rows = db.query(sql, mail, function (err, results) {
            if (err) throw err;
            if (rows.length == 1 && rows[0].type === 3) {
                callback(true)
            } else {
                callback(false);
            }
        });
    },
    readOrga: function (nom, callback) {
        db.query("select * from ORGANISATION where nom= ?", nom, function
            (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    deleteUser: function (mail, callback) {
        db.query("DELETE * from UTILISATEUR where mail= ?", mail, function
        (err, results) {
        if (err) throw err;
        callback(results);
    });
    },
    readUser: function (mail, callback) {
        db.query("SELECT nom, prenom, mail, telephone, dateCreation, statut FROM UTILISATEUR WHERE mail=?", mail, function(err, results) {
        console.log(result);
        if (err) throw err;
        callback(results[0]);
    });
    },
}