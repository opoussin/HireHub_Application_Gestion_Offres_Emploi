/*
RECRUTEUR
updateOrga O
deleteOrga O
creatOffre O
deleteOffre O
updateOffre O
readAllCandidat O
readAllOffreOrga O
updateOffreEtat O
creatFiche O
deleteFiche O
updateFiche O
acceptCandidat O
deleteRecruteurOrga O
readAllDmdRecruteur O
*/

var db = require('./db.js');

module.exports = {
    creatOffre: function (numero, organisation, etat, dateValidite, pieces, nombrePieces, callback) {
        var sql = mysql.format("INSERT INTO OFFRE (numero, organisation, etat, dateValidite, pieces, nombrePieces) VALUES (?,?,?,?,?,?)", [numero, organisation, etat, dateValidite, pieces, nombrePieces]);

        db.query(sql, function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    deleteFiche: function (offre, callback) {
        var sql = mysql.format("DELETE FROM FICHE_POSTE WHERE offre=?");
        db.query(sql, function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    deleteOffre: function (numero, callback) {
        var sql = mysql.format("DELETE FROM OFFRE WHERE numero=?");
        deleteFiche(numero);
        db.query(sql, function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    updateOrga: function (nom, type, siegeSocial, siren, callback) {
        var sql = mysql.format("UPDATE UTILISATEUR SET nom =?, type=?, siegeSocial=? WHERE siren=?", [nom, type, siegeSocial, siren]);
        db.query(sql, function (err, results) {
            if (err) throw err;
            callback(results);
        });

    },
    updateOffre: function (etat, dateValidite, pieces, nombrePieces, numero, organisation, callback) {
        var sql = mysql.format("UPDATE UTILISATEUR SET  etat=?, dateValidite=?, pieces=? , nombrePieces WHERE numero=? AND organisation= ?", [etat, dateValidite, pieces, nombrePieces, numero, organisation]);
        db.query(sql, function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    readAllCandidat: function (callback) {
        db.query("SELECT u.mail, u.nom, u.prenom, u.telephone FROM CANDIDATURE c INNER JOIN UTILISATEUR u ON c.candidat=u.mail WHERE c.offre =?", function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    readAllOffreOrga: function (callback) {
        db.query("SELECT f.intitule, f.statut, f.responsable, f.type, f.lieu, f.rythme, f.salaire, f.description  FROM (OFFRE o INNER JOIN ORGANISATION org ON o.organisation=org.siren) INNER JOIN FICHE_POSTE f ON f.offre = o.numero", function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    updateOffreEtat: function (numero, organisation, callback) {
        var sql = mysql.format("UPDATE OFFRE SET  etat=? WHERE numero=? AND organisation= ?", [numero, organisation]);
        db.query(sql, function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    creatFiche: function (offre, intitule, statut, responsable, type, lieu, rythme, salaire, description, callback) {
        var sql = mysql.format("INSERT INTO FICHE_POSTE (offre, intitule, statut, responsable, type, lieu, rythme, salaire, description) VALUES (?,?,?,?,?,?,?,?,?)", [offre, intitule, statut, responsable, type, lieu, rythme, salaire, description]);

        db.query(sql, function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    updateFiche: function (intitule, statut, responsable, type, lieu, rythme, salaire, description, offre, callback) {
        var sql = mysql.format("UPDATE FICHE_POSTE SET intitule=?, statut=?, responsable=?, type=?, lieu=?, rythme=?, salaire=?, description=? WHERE offre=?", [intitule, statut, responsable, type, lieu, rythme, salaire, description, offre]);
        db.query(sql, function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    acceptCandidat: function (offre, callback) {
        deleteOffre(offre);
        var sql = mysql.format("DELETE FROM CANDIDATURE WHERE offre=?");
        db.query(sql, function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    readAllDmdRecruteur: function (mail, orga, callback) {
        var sql = mysql.format("SELECT u.nom, u.prenom FROM UTILISATEUR u INNER JOIN DMD_RECRUTEUR r ON u.mail=r.recruteur WHERE f.organisation=?");
        db.query(sql, function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },




    /*quitter une organisation */
    deleteRecruteurOrga: function (siren, mail, callback) {
        var sql = mysql.format("UPDATE UTILISATEUR SET type = 1 WHERE mail IN ( SELECT u.mail FROM UTILISATEUR u INNER JOIN APPARTENIR_ORGA a ON u.mail = a.utilisateur WHERE organisation =? AND mail=? GROUP BY utilisateur HAVING COUNT(*) = 1 )");
        var sql2 = mysql.format("DELETE FROM APPARTENIR_ORGA WHERE organisation=? AND utilisateur=mail");
        db.query(sql, function (err, results) {
            if (err) throw err;
            callback(results);
        });
        db.query(sql2, function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    deleteOrga: function (siren, callback) {
        var sql = mysql.format("UPDATE UTILISATEUR SET type = 1 WHERE mail IN ( SELECT mail FROM UTILISATEUR u INNER JOIN APPARTENIR_ORGA a ON u.mail = a.utilisateur WHERE organisation =? GROUP BY utilisateur HAVING COUNT(*) = 1 )");
        var sql2 = mysql.format("DELETE FROM ORGANISATION WHERE siren=?");
        deleteOffre(siren);
        var sql3 = mysql.format("DELETE FROM DMD_RECRUTEUR WHERE organisation=?");
        var sql4 = mysql.format("DELETE FROM DMD_ORGA WHERE siren=?");
        var sql5 = mysql.format("DELETE FROM APPARTENIR_ORGA WHERE siren=?");
        db.query(sql, function (err, results) {
            if (err) throw err;
            callback(results);
        });
        db.query(sql2, function (err, results) {
            if (err) throw err;
            callback(results);
        });
        db.query(sql3, function (err, results) {
            if (err) throw err;
            callback(results);
        });
        db.query(sql4, function (err, results) {
            if (err) throw err;
            callback(results);
        });
        db.query(sql5, function (err, results) {
            if (err) throw err;
            callback(results);
        });
    }
}


