/* 
ADMIN
readUser
readAllUser
creatOrga
acceptOrga
disableUser
enableUser
acceptAdmin
acceptRecruteur
readAllDmdOrga
readAllDmdAdmin
*/
var db = require('./db.js');

module.exports = {
    readUser: function (mail, callback) {
        db.query("select * from UTILISATEUR where mail= ?", mail, function
            (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    readAllUser: function (callback) {
        db.query("select * from UTILISATEUR", function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    acceptOrga: function (nom, siren, type, siegesocial, callback) {
        sql = "SELECT siren FROM UTILISATEURS WHERE siren = ?";
        rows = db.query(sql, siren, function (err, results) {
            if (err) throw err;
            if (rows.length == 1 ) {
                callback(false)
            } else {
                var sql2 = mysql.format("INSERT INTO UTILISATEUR VALUES (?,?,?,?)", [nom, siren, type, siegesocial]);
                db.query(sql2, function (err, result) {
                if (err) throw err;
                callback(results);
            });
            }
        });
    },
    disableUser: function (callback) {
        var sql = mysql.format("UPDATE UTILISATEUR SET etat=0 WHERE mail=?");

        db.query(sql, function (err, result) {
                if (err) throw err;
                callback(result);
            });
    },
    enableUser: function (callback) {
        var sql = mysql.format("UPDATE UTILISATEUR SET etat=1 WHERE mail=?");

        db.query(sql, function (err, result) {
                if (err) throw err;
                callback(result);
            });
    },
    acceptAdmin: function (callback) {
        var sql = mysql.format("UPDATE UTILISATEUR SET type=3 WHERE mail=?");

        db.query(sql, function (err, result) {
                if (err) throw err;
                callback(result);
            });
    },
    creatOrga: function (mail, callback) {
    
    },
    acceptOrga: function (mail, callback) {
    
    },
    acceptRecruteur: function (mail, callback) {
    
    },
    readAllDmdOrga: function (mail, callback) {
    
    },
    readAllDmdAdmin: function (mail, callback) {
    
    },
}

/* ancienne version
var db = require('./db.js');
module.exports = {
    readAll: function (callback) {
        db.query("select * from UTILISATEUR", function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    acceptOrga: function (nom, siren, type, siegesocial, callback) {
        sql = "SELECT siren FROM UTILISATEURS WHERE siren = ?";
        rows = db.query(sql, siren, function (err, results) {
            if (err) throw err;
            if (rows.length == 1 ) {
                callback(false)
            } else {
                var sql2 = mysql.format("INSERT INTO UTILISATEUR VALUES (?,?,?,?)", [nom, siren, type, siegesocial]);
                db.query(sql2, function (err, result) {
                if (err) throw err;
                callback(results);
            });
            }
        });
    },
    desactiverCompte: function (callback) {
        var sql = mysql.format("UPDATE UTILISATEUR SET etat=0 WHERE mail=?");

        db.query(sql, function (err, result) {
                if (err) throw err;
                callback(result);
            });
    },
    activerCompte: function (callback) {
        var sql = mysql.format("UPDATE UTILISATEUR SET etat=1 WHERE mail=?");

        db.query(sql, function (err, result) {
                if (err) throw err;
                callback(result);
            });
    },
    acceptAdmin: function (callback) {
        var sql = mysql.format("UPDATE UTILISATEUR SET type=3 WHERE mail=?");

        db.query(sql, function (err, result) {
                if (err) throw err;
                callback(result);
            });
    },

}
*/