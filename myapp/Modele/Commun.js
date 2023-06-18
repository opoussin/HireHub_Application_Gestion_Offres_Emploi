/*COMMUN
areUserValid
creatUser
areRecruteur
areAdmin
readOrga
readAllOrga
deleteUser
readUser
readOrgaUser
*/


var db = require('./db.js');
var mysql = require('mysql');
var crypt = require('../Modele/pass.js')



module.exports = {
    
    areUserValid: function (mail, mdp, callback) {
        sql = "SELECT * FROM UTILISATEUR WHERE mail = ?";
        db.query(sql, mail, function (err, rows) {
            if(err) callback(false);
            if (rows.length == 1 ){
                crypt.comparePassword(mdp,rows[0].mdp, function(result){
                if(result){
                    callback(rows[0]);
                } else {
                callback(false);
            }});
            }else{
                callback(false);
            }
        });
    },
    creatUser: function (mail, nom, prenom, mdp, telephone, callback) {
        var sql = mysql.format("INSERT INTO UTILISATEUR (mail, mdp, nom, prenom, telephone) VALUES (?,?,?,?,?)", [mail, mdp, nom, prenom, telephone]);
        console.log(sql);
        db.query(sql, function (err, results) {
                if(err){
                    return callback(false);
                }
                callback(true);
            });
    },

    areRecruteur: function (mail, callback) {
        sql = "SELECT * FROM UTILISATEUR WHERE mail = ?";
        db.query(sql, mail, function (err, rows) {
            if(err) callback(false);
            if (rows.length == 1 && rows[0].type === 2) {
                callback(true);
            } else {
                callback(false);
            }
        });
    },
    areRecruteurValid: function (mail, callback) {
        sql = "SELECT * FROM APPARTENIR_ORGA WHERE mail = ?";
        db.query(sql, mail, function (err, rows) {
            if(err) callback(false);
            if (rows.length >=1) {
                callback(true);
            } else {
                callback(false);
            }
        });
    },
    
    areAdmin: function (mail, callback) {
        sql = "SELECT type FROM UTILISATEUR WHERE mail = ?";
        rows = db.query(sql, mail, function (err, rows) {
            if(err) callback(false);
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
            if (err) return callback(false);
            callback(results);
        });
    },
    readAllOrga: function (callback) {
        db.query("select * from ORGANISATION", function
            (err, results) {
            if (err) return callback(false);
            callback(results);
        });
    },
    deleteUser: function (mail, callback) {
        db.query("DELETE from UTILISATEUR where mail= ?", mail, function
        (err, results) {
        if (results.affectedRows == 0) return callback(false);
        callback(true);
    });
    },
    readUser: function (mail, callback) {
        db.query("SELECT * FROM UTILISATEUR WHERE mail=?", mail, function(err, result) {
        if (err) return callback(false);
        callback(result[0]);
        });
    },
    readOrgaUser: function (mail, callback) {
        db.query("SELECT organisation FROM APPARTENIR_ORGA WHERE mail=?", mail, function(err, results) {
        if (err) return callback(false);
        callback(results);
        });
    },

}
