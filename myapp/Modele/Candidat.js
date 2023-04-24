/*CANDIDAT
updateUser
updateUserMdp
readAllOffreValide
readOffreFiltre
creatDmdOrga
creatDmdRecruteur
creatDmdAdmin
creatCandidature
deleteCandidature
updateCandidature
readAllCandidature
deleteDmdOrga
deleteDmdRecruteur
deleteDmdAdmin
readUserDmdOrga
readUserDmdRecruteur
readUserDmdAdmin
*/
var db = require('./db.js');
var mysql = require('mysql');


module.exports = {
    updateUser: function (mail, nom, prenom, telephone, callback) {
       
        var sql = mysql.format("UPDATE UTILISATEUR SET nom =?, prenom=?, telephone=? WHERE mail=?", [nom, prenom, telephone, mail]);

        db.query(sql, function (err, results) {
                if (err) throw err;
                callback(results);
            });
        
    },
    updateUserMdp: function (mdp1, mdp2, mail, callback) {
       
        var sql = mysql.format("UPDATE UTILISATEUR SET mdp =? WHERE mail=? CHECK ?=?", [mdp1, mail, mdp1, mdp2]);
// je pense que le check est pas à faire dans le SQL
        db.query(sql, function (err, results) {
                if (err) throw err;
                callback(results);
            });
        
    },

    readAllOffreValide: function (callback) {
        db.query("select * from OFFRE INNER JOIN FICHE ON OFFRE.numero = FICHE.numero INNER JOIN ON OFFRE.siren = ORGANISATION.siren where OFFRE.etat= publiee", function
            (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    readOffreFiltre: function (organisation, lieu, statut, salaire, type, intitule, callback) {

        var sql = mysql.format("select * from OFFRE INNER JOIN FICHE ON OFFRE.numero = FICHE.numero INNER JOIN ON OFFRE.siren = ORGANISATION.siren where OFFRE.etat= publiee");

        
        if (intitule!='') {
            sql += ` AND WHERE ${intitule=intitule}`;
        }
        if (organisation!='') {
            sql += ` AND WHERE ${organisation=nom}`;
        }

        if (lieu!='') {
            sql += ` AND WHERE ${lieu=lieu}`;
        }

        if (statut!=NULL) {
            sql += ` AND WHERE ${statut=statut}`;
        }
        /*if (salaire!=NULL) {
            sql += ` AND WHERE ${}`;
        }*/
        if (type!=NULL) {
            sql += ` AND WHERE ${type=type}`;
        }
        db.query(sql, function (err, results) {
            callback(err!=undefined);
        });

        
    },
    creatDmdOrga: function (nom, siren, type, siegeSocial, mail, callback) {
        sql = "SELECT siren FROM ORGANISATION WHERE siren = ?";
        rows = db.query(sql, siren, function (err, results) {
            if (err) throw err;
            if (rows.length == 1 ) {
                callback(false)
            } else {
                var sql = mysql.format("INSERT INTO DMD_ORGA (nom, siren, type, siegeSocial, recruteur) VALUES (?,?,?,?,?)", [nom, siren, type, siegeSocial, mail]);

                db.query(sql, function (err, results) {
                    if (err) throw err;
                callback(results);
        });
            }
        });
        
    },
    creatDmdRecruteur: function (mail, siren, callback) {
        var sql = mysql.format("INSERT INTO DMD_RECRUTEUR (recruteur, organisation) VALUES (?,?)", [mail,siren]);

        db.query(sql, function (err, results) {
            callback(err!=undefined);
        });
    },
    creatDmdAdmin: function (mail, callback) {
        var sql = mysql.format("INSERT INTO DMD_ADMIN (utilisateur) VALUES (?)", [mail]);

        db.query(sql, function (err, results) {
            callback(err!=undefined);
        });
    },
    creatCandidature: function (mail, callback) {
        
    },
    deleteCandidature: function (mail, callback) {
        
    },
    updateCandidature: function (mail, callback) {
        
    },
    /*readAllCandidature: function (mail, callback) {
        
        db.query("select * from CANDIDATURE where candidat=?", mail, function
            (err, results) {
            if (err) throw err;
            callback(results);
        });
    },*/
    readAllCandidature: function (mail, callback) {
        
        db.query("select * from (CANDIDATURE c INNER JOIN OFFRE o ON c.offre=o.numero) INNER JOIN FICHE_POSTE f ON f.offre=o.numero where candidat=?", mail, function
            (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    deleteDmdOrga: function (siren, callback) {
        db.query("DELETE FROM DMD_ORGA where mail= ?", siren, function
        (err, results) {
        if (err) throw err;
        callback(results);
    });
    },
    deleteDmdRecruteur: function (mail, callback) {
        db.query("DELETE FROM DMD_RECRUTEUR where recruteur= ?", mail, function
        (err, results) {
        if (err) throw err;
        callback(results);
    });
    },
    deleteDmdAdmin: function (mail, callback) {
        db.query("DELETE FROM DMD_ADMIN where mail= ?", mail, function
        (err, results) {
        if (err) throw err;
        callback(results);
    });
    },
    readUserDmdOrga: function (mail, callback) {
        db.query("select * from DMD_ORGA where recruteur=?", mail, function
            (err, results) {
            if (err) throw err;
            callback(results);
        });
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
    readUserDmdRecruteur: function (mail, callback) {
        var sql = "select * from DMD_RECRUTEUR where recruteur=?";
        db.query(sql, mail, function (err, results) {
            
            if (err) throw err;
            if (results.length != 0) { 
                callback(results)
            } else { 
                callback(false);
            }
        });
    },
    readUserDmdAdmin: function (mail, callback) {
        db.query("select * from DMD_ADMIN where candidat=?", mail, function
            (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

}