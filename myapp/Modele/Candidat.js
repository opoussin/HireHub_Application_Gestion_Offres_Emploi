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
        console.log("hors query");
        db.query(sql, function (err) {
            console.log("dans la query");
                if (err) throw err;
                callback();
            });
        

    },
    updateUserMdp: function (mdp1, mail, callback) {

        var sql = mysql.format("UPDATE UTILISATEUR SET mdp =? WHERE mail=?", [mdp1, mail]);
        // je pense que le check est pas à faire dans le SQL
        db.query(sql, function (err) {
            if (err) throw err;
            callback();
        });

    },

    readAllOffreValide: function (callback) {
        db.query("SELECT * FROM OFFRE INNER JOIN FICHE_POSTE ON OFFRE.numero = FICHE_POSTE.offre INNER JOIN ORGANISATION ON ORGANISATION.siren=OFFRE.organisation WHERE OFFRE.etat='publiee'", function
            (err, results) {
            console.log(results);
            if (err) throw err;
            callback(results);
        });
    },

    readOffreFiltre: function (organisation, lieu, statut, salaire, type, intitule, callback) {

        var sql = mysql.format("SELECT * FROM OFFRE INNER JOIN FICHE_POSTE ON OFFRE.numero = FICHE_POSTE.offre INNER JOIN ORGANISATION ON ORGANISATION.siren=OFFRE.organisation WHERE OFFRE.etat='publiee'");

        console.log ("req body candidat.js", organisation, lieu, statut, salaire, type, intitule);
        if ( intitule !== "") {
            console.log("A");
            console.log("intitule",intitule);
            sql += `AND FICHE_POSTE.intitule = \'${intitule}\'`;
        }
        if ( organisation !== "") {
            console.log("organisation", organisation);
            sql +=  `AND ORGANISATION.nom = \'${organisation}\'`;
        
        }
        if ( lieu !== "") {
            console.log("lieu", lieu);
            sql += `AND FICHE_POSTE.lieu = \'${lieu}\'`;
        }

        if ( statut !== "") {
            console.log("statut", statut);
            sql += `AND FICHE_POSTE.statut = \'${statut}\'`;
        }
        if ( salaire !== "") {
            console.log("salaire", salaire);
            sql += `AND FICHE_POSTE.type > ${salaire}`;
        }
        if ( type !== "") {
            console.log("type", type);
            sql += `AND FICHE_POSTE.type = \'${type}\'`;
        }
        db.query(sql, function (err, results) {
            console.log(sql);
            console.log("C");
            console.log("resultt",results);
            callback(results);
        });


    },
    creatDmdOrga: function (nom, siren, type, siegeSocial, mail, callback) {
        sql = "SELECT siren FROM ORGANISATION WHERE siren = ?";
        rows = db.query(sql, siren, function (err, results) {
            if (err) throw err;
            if (rows.length == 1) {
                callback(false) //orga existe déjà
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
        var sql = mysql.format("INSERT INTO DMD_RECRUTEUR (recruteur, organisation) VALUES (?,?)", [mail, siren]);

        db.query(sql, function (err, results) {
            callback(err != undefined);
        });
    },
    creatDmdAdmin: function (mail, callback) {
        var sql = mysql.format("INSERT INTO DMD_ADMIN (utilisateur) VALUES (?)", [mail]);

        db.query(sql, function (err, results) {
            callback(err != undefined);
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
    deleteDmdRecruteurOrga: function (mail,siren, callback) {
        db.query("DELETE FROM DMD_RECRUTEUR where recruteur= ? AND organisation= ?", [mail, siren], function
            (err) {
            if (err) throw err;
            callback();
        });
    },
    deleteDmdAdmin: function (mail, date, callback) {
        db.query("DELETE FROM DMD_ADMIN where utilisateur= ? AND date=?", [mail,date], function
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
    readOrga: function (callback) {
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
            console.log(results);
            if (err) throw err;
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
            if (err) throw err;
            callback(results);
        });
    },
}