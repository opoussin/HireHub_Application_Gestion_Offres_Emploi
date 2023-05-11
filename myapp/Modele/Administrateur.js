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
readUserFiltre

*/
var db = require('./db.js');
var mysql = require('mysql');


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
    /*acceptOrga: function (nom, siren, type, siegesocial, callback) {
        var sql = "SELECT * FROM ORGANISATION WHERE siren = ?";
        rows = db.query(sql, siren, function (err, results) {
            if (err) throw err;
            if (rows.length == 1 ) {
                callback(false)
            } else {
                var sql2 = mysql.format("INSERT INTO ORGANISATION VALUES (?,?,?,?)", [nom, siren, type, siegesocial]);
                db.query(sql2, function (err, result) {
                if (err) throw err;
                callback(results);
            });
            }
        });
    },*/

    disableUser: function (mail, callback) {
        
        db.query("UPDATE UTILISATEUR SET statut=0 WHERE mail=?", mail, function
            (err, results) {
            if (err) throw err;
            callback();
        });
    },

    enableUser: function (mail, callback) {
        db.query("UPDATE UTILISATEUR SET statut=1 WHERE mail=?", mail, function
            (err, results) {
            if (err) throw err;
            callback();
        });
    },

    acceptAdmin: function (mail, callback) {
        db.query("UPDATE UTILISATEUR SET type=3 WHERE mail=?", mail, function
            (err, results) {
            if (err) throw err;
            callback();
        });
    },

    creatOrga: function (mail, callback) {
        db.query("INSERT INTO ORGANISATION (nom, siren, type, siegesocial) VALUES (?,?,?,?)", [nom, siren, type, siegesocial], function
            (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    readOrgaSiren : function ( siren, callback){
        db.query("select * from ORGANISATION where siren= ?", siren, function
            (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    acceptOrga: function (nom, siren, type, siegesocial, mail, callback) {
        if (!this.readOrgaSiren(siren, callback)) {
           this.creatOrga(nom, siren, type, siegesocial, callback);
           this.acceptRecruteur(mail, siren, callback);
        } else {
            callback(false);
        }   
    
    },
    acceptRecruteur: function (mail, siren, callback) {
        sql = "SELECT * FROM APPARTENIR_ORGA WHERE organisation = ? AND utilisateur = ?";
        rows = db.query(sql, [siren, mail], function (err, results) {
            if (err) throw err;
            if (rows.length == 1 ) {
                callback(false)
            } else {
                var sql2 = mysql.format("INSERT INTO APPARTENIR_ORGA VALUES (?,?)", [siren, mail]);
                db.query(sql2, function (err, result) {
                if (err) throw err;
                callback(results);
            });
            }
        });
    },
    readAllDmdOrga: function (callback) {
        db.query("select * from DMD_ORGA ", function
        (err, results) {
        if (err) throw err;
        callback(results);
        });
    },
    readAllDmdAdmin: function (callback) {
        db.query("select * from DMD_ADMIN ", function
        (err, results) {
        if (err) throw err;
        callback(results);
        });
    },

    readUserFiltre: function (mail, nom, prenom, date, type, statut, callback) {
        console.log("mail" + mail + "nom" + nom + "prenom" + prenom + "date" + date);
        var sql = mysql.format("SELECT * FROM UTILISATEUR WHERE 1");
        
        if ( mail !== undefined && mail !== "") {            
            sql += ` AND  mail like "%${mail}%"`;
        }
        if ( nom !== undefined && nom !== "") {            
            sql += ` AND  nom like "%${nom}%"`;
        }
        if ( prenom !== undefined && prenom !== "") {
            sql +=  ` AND  prenom like "%${prenom}%"`;
        
        }
        if ( date !== undefined && date !== "") {
            sql += ` AND  CAST(dateCreation as DATE)="${date}"`;
        }

        if ( type !== undefined && type !== "") {
            sql += ` AND type=${type}`;
        }
        if ( statut !== undefined && statut !== "") {
            sql += ` AND statut=${statut}`;
        }

        db.query(sql, function (err, results) {
            console.log(err);
            console.log(sql);
            console.log("results" + results);
            callback(results);
        });


    },
}
