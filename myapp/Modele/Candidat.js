/*CANDIDAT
updateUser
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
    readAllOffreValide: function (callback) {
        db.query("select * from OFFRE INNER JOIN FICHE ON OFFRE.numero = FICHE.numero where OFFRE.etat= publiee", function
            (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    readOffreFiltre: function (mail, callback) {
        
    },
    creatDmdOrga: function (nom, siren, type, siegeSocial, mail, callback) {
        var sql = mysql.format("INSERT INTO DMD_ORGA (nom, siren, type, siegeSocial, recruteur) VALUES (?,?,?,?)", [nom, siren, type, siegeSocial, mail]);

        db.query(sql, function (err, results) {
            if (err) throw err;
            callback(results);

        });
    },
    creatDmdRecruteur: function (siren, mail, callback) {
        var sql = mysql.format("INSERT INTO DMD_RECRUTEUR (organisation, recruteur) VALUES (?,?)", [siren, mail]);

        db.query(sql, function (err, results) {
            if (err) throw err;
            callback(results);

        });
    },
    creatDmdAdmin: function (mail, callback) {
        var sql = mysql.format("INSERT INTO DMD_ADMIN (recruteur) VALUES (?)", [mail]);

        db.query(sql, function (err, results) {
            if (err) throw err;
            callback(results);

        });
    },
    creatCandidature: function (mail, callback) {
        
    },
    deleteCandidature: function (mail, callback) {
        
    },
    updateCandidature: function (mail, callback) {
        
    },
    readAllCandidature: function (mail, callback) {
        db.query("select * from CANDIDATURE where candidat=?", mail, function
            (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    deleteDmdOrga: function (siren, callback) {
        db.query("DELETE * from DMD_ORGA where mail= ?", siren, function
        (err, results) {
        if (err) throw err;
        callback(results);
    });
    },
    deleteDmdRecruteur: function (mail, callback) {
        db.query("DELETE * from DMD_RECRUTEUR where recruteur= ?", mail, function
        (err, results) {
        if (err) throw err;
        callback(results);
    });
    },
    deleteDmdAdmin: function (mail, callback) {
        db.query("DELETE * from DMD_ADMIN where mail= ?", mail, function
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
    readUserDmdRecruteur: function (mail, callback) {
        db.query("select * from DMD_RECRUTEUR where recruteur=?", mail, function
            (err, results) {
            if (err) throw err;
            callback(results);
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