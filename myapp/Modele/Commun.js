/*COMMUN
areUserValid
creatUser
areRecruteur
areAdmin
readOrga
deleteUser
readUser
readOrgaUser
*/


var db = require('./db.js');
var mysql = require('mysql');


module.exports = {
    
    areUserValid: function (mail, mdp, callback) {
        sql = "SELECT * FROM UTILISATEUR WHERE mail = ?";
        db.query(sql, mail, function (err, rows) {
            //if (err) throw err;
            if (rows.length == 1 && rows[0].mdp === mdp) {
                //var type = rows[0].mdp 
                callback(rows[0]);
            } else {
                callback(undefined);
            }
        });
    },
    creatUser: function (mail, nom, prenom, mdp, telephone, callback) {
        var sql = mysql.format("INSERT INTO UTILISATEUR (mail, mdp, nom, prenom, telephone) VALUES (?,?,?,?,?)", [mail, mdp, nom, prenom, telephone]);

        db.query(sql, function (err, results) {
                callback(err!=undefined);//??
            });
    },

    areRecruteur: function (mail, callback) {
        sql = "SELECT * FROM UTILISATEUR WHERE mail = ?";
        db.query(sql, mail, function (err, rows) {
            if (rows.length == 1 && rows[0].type === 2) {
                callback(true);
            } else {
                callback(false);
            }
        });
    },
    /*
    areRecruteur: function (mail, callback) {
        sql = "SELECT type FROM UTILISATEUR WHERE mail = ?";
        db.query(sql, mail, function (err, results) {
            if (err) throw err;
            if (results.length == 1 && results[0].type === 2) {
                callback(true)
            } else {
                callback(false);
            }
        });
    },
    */
    
    areAdmin: function (mail, callback) {
        sql = "SELECT type FROM UTILISATEUR WHERE mail = ?";
        rows = db.query(sql, mail, function (err, rows) {
            if (err) throw err;
            if (rows.length == 1 && rows[0].type === 3) {
                callback(true)
            } else {
                callback(false);
            }
        });
    },
    readOrga: function (siren, callback) {
        db.query("select * from ORGANISATION where siren= ?", siren, function
            (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    deleteUser: function (mail, callback) {
        db.query("DELETE from UTILISATEUR where mail= ?", mail, function
        (err, results) {
        if (err) throw err;
        callback();
    });
    },
    readUser: function (mail, callback) {
        db.query("SELECT * FROM UTILISATEUR WHERE mail=?", mail, function(err, result) {
        console.log(result);
        if (err) throw err;
        callback(result[0]);
    });
    },
    readOrgaUser: function (mail, callback) {
        db.query("SELECT organisation FROM APPARTENIR_ORGA WHERE mail=?", mail, function(err, results) {
        //console.log(result);
        if (err) throw err;
        callback(results[0]);
    });
    },

}
