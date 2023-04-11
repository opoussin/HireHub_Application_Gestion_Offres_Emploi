/*COMMUN
areUserValid
creatUser
areRecruteur
areAdmin
readOrga
deleteUser
*/
var db = require('./db.js');

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
        //var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        var sql = mysql.format("INSERT INTO UTILISATEUR (mail, mdp, nom, prenom, telephone) VALUES (?,?,?,?,?)", [mail, mdp, nom, prenom, telephone]);

        db.query(sql, function (err, results) {
                if (err) throw err;
                callback(results);
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
    readOrga: function (mail, callback) {
    
    },
    deleteUser: function (mail, callback) {
    
    },
}