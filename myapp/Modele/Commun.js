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
            console.log(rows);

            //if (rows.length == 1 ){
                /*console.log(mdp);
                console.log(rows[0].mdp,);
                if (crypt.comparePassword(mdp,rows[0].mdp, function(err, result){
                    if (err) {console.log("ya err");}//catch l'erreur
                })
                ){*/
                    //console.log("le comapre marche");
                    callback(rows[0]);
                      /*
            } else {
                console.log("C LA FONCTION DE HACHAGE");

                callback(false);
            }*/
        //}
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
        if (err) return callback(false);
        callback();
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
        callback(results[0]);
    });
    },

}
