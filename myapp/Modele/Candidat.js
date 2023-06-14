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
deleteDmdRecruteurOrga
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
        db.query(sql, function (err) {
                if (err) return callback(false);
                callback(true);
            });
        

    },
    updateUserMdp: function (mdp1, mail, callback) {

        var sql = mysql.format("UPDATE UTILISATEUR SET mdp =? WHERE mail=?", [mdp1, mail]);
        db.query(sql, function (err) {
            if (err) return callback(false);
            callback(true);
        });

    },

    readAllOffreValide: function (callback) {
        db.query("SELECT * FROM OFFRE INNER JOIN FICHE_POSTE ON OFFRE.numero = FICHE_POSTE.offre INNER JOIN ORGANISATION ON ORGANISATION.siren=OFFRE.organisation WHERE OFFRE.etat='publiee'", function
            (err, results) {
            if (err) return callback(false);
            callback(results);
        });
    },

    readOffreFiltre: function (organisation, lieu, statut, salaire, type, intitule, callback) {
        var sql = mysql.format("SELECT * FROM OFFRE INNER JOIN FICHE_POSTE ON OFFRE.numero = FICHE_POSTE.offre INNER JOIN ORGANISATION ON ORGANISATION.siren=OFFRE.organisation WHERE OFFRE.etat='publiee'");
        if ( intitule !== "") {
            sql += `AND FICHE_POSTE.intitule like "%${intitule}%"`;
        }
        if ( organisation !== "") {
            sql +=  `AND ORGANISATION.nom like "%${organisation}%"`;
        }
        if ( lieu !== "") {
            sql += `AND FICHE_POSTE.lieu like "%${lieu}%"`;
        }
        if ( statut !== "" && statut !== "undefined" ) {
            sql += `AND FICHE_POSTE.statut like "%${statut}%"`;
        }
        if ( salaire !== "") {
            sql += `AND FICHE_POSTE.type > ${salaire}`;
        }
        if ( type !== "") {
            sql += `AND FICHE_POSTE.type like "%${type}%"`;
        }
        db.query(sql, function (err, results) {
            if(err) return callback(false);
            callback(results);
        });


    },
    creatDmdOrga: function (nom, siren, type, siegeSocial, mail, callback) {
        sql = "SELECT siren FROM ORGANISATION WHERE siren = ?";
        rows = db.query(sql, siren, function (err, results) {
            if (err) return callback(false);
            if (rows.length == 1) {
                callback(false) //orga existe déjà
            } else {
                var sql = mysql.format("INSERT INTO DMD_ORGA (nom, siren, type, siegeSocial, recruteur) VALUES (?,?,?,?,?)", [nom, siren, type, siegeSocial, mail]);

                db.query(sql, function (err, results) {
                    if (err) return callback(false);
                    callback(results);
                });
            }
        });

    },


    //////////////// DELIMITATION \\\\\\\\\\\\\\\\\
    creatDmdRecruteur: function (mail, siren, callback) {
        var sql = mysql.format("INSERT INTO DMD_RECRUTEUR (recruteur, organisation) VALUES (?,?)", [mail, siren]);

        db.query(sql, function (err, results) {
            if(affectedRows.results == 0){
                return callback(false);
            }
            callback(true);
        });
    },
    creatDmdAdmin: function (mail, callback) {
        var sql = mysql.format("INSERT INTO DMD_ADMIN (utilisateur) VALUES (?)", [mail]);
        db.query(sql, function (err, results) {
            if(affectedRows.results == 0){
                return callback(false);
            }
            callback(true);
        });
    },
    creatCandidature: function (mail, numero, fichier, callback) {
        var sql = mysql.format("INSERT INTO CANDIDATURE (candidat, offre, piecesC) VALUES (?,?,?)", [mail, numero, fichier]);

        db.query(sql, function (err, results) {
            if(affectedRows.results == 0){
                return callback(false);
            }
            callback(true);
            });
    },
    deleteCandidature: function (mail, numero, callback) {
        db.query("DELETE FROM CANDIDATURE where candidat= ? AND offre =?",[mail, numero], function
            (err, results) {
            if(affectedRows.results == 0){
                return callback(false);
            }
            callback(true);
        });

    },
    updateCandidature: function (files, mail, numero, callback) {
        var sql = mysql.format("UPDATE CANDIDATURE SET piecesC =? where offre=? AND candidat=?", [files, numero, mail]);
        db.query(sql, function (err, result) {
            if (result.affectedRows == 0){
                callback(false);
            }else{
                callback(true);
            }
        });
        
    },
    
    readAllCandidature: function (mail, callback) {
        db.query("select * from (CANDIDATURE c INNER JOIN OFFRE o ON c.offre=o.numero) INNER JOIN FICHE_POSTE f ON f.offre=o.numero INNER JOIN ORGANISATION ON ORGANISATION.siren=o.organisation where candidat=?", mail, function
            (err, results) {
                if(affectedRows.results == 0){
                    return callback(false);
                }
                callback(true);
        });
    },
    readCandidature: function (mail, numero, callback) {

        db.query("select * from (CANDIDATURE c INNER JOIN OFFRE o ON c.offre=o.numero) INNER JOIN FICHE_POSTE f ON f.offre=o.numero INNER JOIN ORGANISATION ON ORGANISATION.siren=o.organisation where candidat=? AND c.offre = ?", [mail, numero], function
            (err, results) {
            if (err) return callback(false);
            callback(results);
        });
    },

    deleteDmdOrga: function (siren, callback) {
        db.query("DELETE FROM DMD_ORGA where siren= ?", siren, function
            (err, results) {
                if(affectedRows.results == 0){
                    return callback(false);
                }
                callback(true);
        });
    },
    deleteDmdRecruteur: function (mail, callback) {
        db.query("DELETE FROM DMD_RECRUTEUR where recruteur= ?", mail, function
            (err, results) {
                if(affectedRows.results == 0){
                    return callback(false);
                }
                callback(true);
        });
    },
    deleteDmdRecruteurOrga: function (mail,siren, callback) {
        db.query("DELETE FROM DMD_RECRUTEUR where recruteur= ? AND organisation= ?", [mail, siren], function
            (err) {
                if(affectedRows.results == 0){
                    return callback(false);
                }
                callback(true);
        });
    },
    deleteDmdAdmin: function (mail, callback) {
        db.query("DELETE FROM DMD_ADMIN where utilisateur= ?", mail, function
            (err, results) {
                if(affectedRows.results == 0){
                    return callback(false);
                }
                callback(true);
        });
    },
    readUserDmdOrga: function (mail, callback) {
        db.query("select * from DMD_ORGA where recruteur=?", mail, function
            (err, results) {
            if (err) return callback(false);
            callback(results);
        });
    },
    readOrga: function ( callback) {
        sql = "SELECT * FROM ORGANISATION ";
        rows = db.query(sql, function (err, results) {
            if (rows.length != 0) { // si il y a au moins une ligne (donc une orga du type)
                callback(results)
            } else { // il n'y a pas d'orga de ce type
                callback(false);
            }
        });
    },
    readOrgaUser: function (siren, callback) {
        sql = "SELECT * FROM ORGANISATION WHERE siren=?";
        rows = db.query(sql, siren, function (err, result) {
            if (err) return callback(false);
            callback(result);
        });
    },
    readUserDmdRecruteur: function (mail, callback) {
        var sql = "select * from DMD_RECRUTEUR where recruteur=?";
        db.query(sql, mail, function (err, results) {
            if (results.length != 0) {
                callback(results)
            } else {
                callback(false);
            }
        });
    },
    readUserDmdAdmin: function (mail, callback) {
        db.query("select * from DMD_ADMIN where utilisateur=?", mail, function
            (err, results) {
            if (err) return callback(false);
            callback(results);
        });
    },
}