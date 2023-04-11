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
    creatOrga: function (nom, siren, type, siegesocial, callback) {
    //penser a inclure readOrga
        var sql = mysql.format("INSERT INTO ORGANISATION (nom, siren, type, siegesocial) VALUES (?,?,?,?)", [nom, siren, type, siegesocial]);

        db.query(sql, function (err, results) {
            if (err) throw err;
            callback(results);

        });

    },
    acceptOrga: function (nom, siren, type, siegesocial, mail, callback) {
        if (readOrga(siren, callback)) {
           creatOrga(nom, siren, type, siegesocial, callback);
           acceptRecruteur(mail, siren, callback);
        } else {
            callback(false);
        }   
    
    },
    acceptRecruteur: function (mail, siren, callback) {
        var sql = mysql.format("INSERT INTO APPARTENIR_ORGA (utilisateur, organisation) VALUES (?,?)", [mail, siren]);
        //rajouter test
        db.query(sql, function (err, results) {
            if (err) throw err;
            callback(results);

        });
    },
    readAllDmdOrga: function (mail, callback) {
        db.query("select * from DMD_ORGA ", function
        (err, results) {
        if (err) throw err;
        callback(results);
        });
    },
    readAllDmdAdmin: function (mail, callback) {
        db.query("select * from DMD_ADMIN ", function
        (err, results) {
        if (err) throw err;
        callback(results);
        });
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