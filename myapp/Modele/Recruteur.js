/*
RECRUTEUR
updateOrga O
deleteOrga O
creatOffre O
deleteOffre O
updateOffre O
readAllCandidat O
readAllOffreOrga O
readAllOffreOrgaRecrut
updateOffreEtat O
creatFiche O
deleteFiche O
updateFiche O
acceptCandidat O
deleteRecruteurOrga O
readAllDmdRecruteur O
readAllOrgaRecruteur
*/

var db = require('./db.js');
var mysql = require('mysql');

module.exports = {
    creatFiche: function (numero, intitule, statut, responsable, type, lieu, rythme, salaire, description, callback) {
        var sql = mysql.format("INSERT INTO FICHE_POSTE (offre, intitule, statut, responsable, type, lieu, rythme, salaire, description) VALUES (?,?,?,?,?,?,?,?,?)", [numero, intitule, statut, responsable, type, lieu, rythme, salaire, description]);

        db.query(sql, function (err, results) {
            if (results.affectedRows == 0) {
                callback(false);
            }else{
                callback(true);
            }
        });
    },
    creatOffre: function (organisation, etat, dateValidite, pieces, nombrePieces, intitule, statut, responsable, type, lieu, rythme, salaire, description, callback) {
        var sql = mysql.format("INSERT INTO OFFRE (organisation, etat, dateValidite, pieces, nombrePieces) VALUES (?,?,?,?,?)", [organisation, etat, dateValidite, pieces, nombrePieces]);
        var self = this;
        var numero = 0;
        db.query(sql, function (err, results) {
            if (affectedRows.results == 0) {
                return callback(false);
            }else{
            
                var sql2 = "SELECT numero FROM OFFRE ORDER BY numero DESC LIMIT 1";
                db.query(sql2, function (err, results) {
                    if (err) {
                        return callback(false);
                    }
                    var numero = results[0].numero;
                    self.creatFiche(numero, intitule, statut, responsable, type, lieu, rythme, salaire, description, callback);
                });
            }
        });
    },
    
    deleteOffre: function (numero, callback) {
        db.query("DELETE FROM OFFRE WHERE numero=?", [numero], function (err){
            if (affectedRows.results == 0) {
                return callback(false);
            }else{
                callback(true);
            }
        });
    },

    deleteFiche: function (offre, callback) {
        var sql = mysql.format("DELETE FROM FICHE_POSTE WHERE offre=?");
        db.query(sql, offre, function (err, results) {
            if (affectedRows.results == 0) {
                return callback(false);
            }else{
                callback(true);
            }
        });
    },
    
    updateOrga: function (nom, type, siegeSocial, siren, callback) {
        var sql = mysql.format("UPDATE UTILISATEUR SET nom =?, type=?, siegeSocial=? WHERE siren=?", [nom, type, siegeSocial, siren]);
        db.query(sql, function (err, results) {
            if (affectedRows.results == 0) {
                return callback(false);
            }else{
                callback(true);
            }
        });

    },
    updateOffre: function (etat, dateValidite, pieces, nombrePieces, numero, callback) {
        var sql = mysql.format("UPDATE OFFRE SET etat=?, dateValidite=?, pieces=?, nombrePieces=? WHERE numero=?", [etat, dateValidite, pieces, nombrePieces, numero]);
        db.query(sql, function (err, results) {
            if (affectedRows.results == 0) {
                return callback(false);
            }else{
                callback(true);
            }
        });
    },
    readAllCandidat: function (numero, callback) {
        db.query("SELECT * FROM CANDIDATURE c INNER JOIN UTILISATEUR u ON c.candidat=u.mail WHERE c.offre =?", numero, function (err, results) {
            if (affectedRows.results == 0) {
                return callback(false);
            }else{
                callback(true);
            }
        });
    },
    readAllOffreOrga: function (siren, callback) {
        sql = "SELECT * FROM OFFRE o INNER JOIN ORGANISATION org ON o.organisation=org.siren INNER JOIN FICHE_POSTE f ON f.offre = o.numero WHERE siren = ?";
        db.query(sql, siren, function (err, results) {
            if (err) return callback([]);
            callback(results);
        });
    },

    readAllOffreOrgaRecrut: function (mail, orga, intitule, date, callback) {
        var sql = "SELECT * FROM OFFRE o INNER JOIN ORGANISATION org ON o.organisation=org.siren INNER JOIN FICHE_POSTE f ON f.offre = o.numero INNER JOIN APPARTENIR_ORGA a ON a.organisation=o.organisation WHERE mail = ?";
        if ( orga !== undefined && orga !== "") {
            sql += ` AND org.siren=${orga}`;
        }
        if ( intitule !== undefined && intitule !== "") {
            sql += ` AND f.intitule like "%${intitule}%"`;
        }
        if ( date !== undefined && date !== "") {
            sql += ` AND  CAST(o.dateValidite as DATE)="${date}"`;
        }

        sql +=' ORDER BY o.numero DESC';
        db.query(sql, mail, function (err, results) {
            if (err) return callback([]);
            callback(results);
        });
    },

    readOffre: function (numero, callback) {
        sql = "SELECT * FROM OFFRE o INNER JOIN FICHE_POSTE f ON f.offre = o.numero WHERE numero = ?";
        db.query(sql, numero, function (err, results) {
            if (err) return callback(false);
            callback(results);
        });
    },
    updateOffreEtat: function (etat, numero, organisation, callback) {
        var sql = mysql.format("UPDATE OFFRE SET  etat=? WHERE numero=? AND organisation= ?", [etat, numero, organisation]);
        db.query(sql, function (err, results) {
            if (affectedRows.results == 0) {
                return callback(false);
            }else{
                callback(true);
            }
        });
    },
    
    updateFiche: function (intitule, statut, responsable, type, lieu, rythme, salaire, description, offre, callback) {
        var sql = mysql.format("UPDATE FICHE_POSTE SET intitule=?, statut=?, responsable=?, type=?, lieu=?, rythme=?, salaire=?, description=? WHERE offre=?", [intitule, statut, responsable, type, lieu, rythme, salaire, description, offre]);
        db.query(sql, function (err, results) {
            if (affectedRows.results == 0) {
                return callback(false);
            }else{
                callback(true);
            }
        });
    },
    acceptCandidat: function (numero, mail, callback) {
        var sql = mysql.format("UPDATE CANDIDATURE SET etatC=1 WHERE offre =? AND candidat=?", [numero, mail]);
        db.query(sql, function (err, result) {
            if (affectedRows.results == 0) {
                return callback(false);
            }else{
                callback(true);
            }
        });
    },
    refuseCandidat: function (numero, mail, callback) {
        var sql = mysql.format("UPDATE CANDIDATURE SET etatC=2 WHERE offre =? AND candidat=?", [numero, mail]);
        db.query(sql, function (err, result) {
            if (affectedRows.results == 0) {
                return callback(false);
            }else{
                callback(true);
            }
        });
    },
    readAllDmdRecruteur: function (siren, callback) {
        var sql = mysql.format("SELECT * FROM UTILISATEUR u INNER JOIN DMD_RECRUTEUR r ON u.mail=r.recruteur INNER JOIN ORGANISATION o ON o.siren=r.organisation");
        if(siren!= undefined && siren.length > 0){
            sql += ` WHERE`
            for(i = 0; i<siren.length; i++){
                sql += ` r.organisation = ${siren}`
                if (i < siren.length - 1){
                    sql += ` OR`
                };
            };
        };
        db.query(sql, function (err, results) {
            if (err) return callback(false);
            callback(results);
        });
    },


    /*quitter une organisation */
    deleteRecruteurOrga: function (siren, mail, callback) {
        var sql = mysql.format("UPDATE UTILISATEUR SET type = 1 WHERE mail IN ( SELECT u.mail FROM UTILISATEUR u INNER JOIN APPARTENIR_ORGA a ON u.mail = a.utilisateur WHERE a.organisation =? AND u.mail=? GROUP BY utilisateur HAVING COUNT(*) = 1 )",[siren,mail]);
        var sql2 = mysql.format("DELETE FROM APPARTENIR_ORGA WHERE organisation=? AND utilisateur=mail", siren);
        db.query(sql, function (err, results) {
            if (affectedRows.results == 0) {
                return callback(false);
            }else{
                db.query(sql2, function (err, results) {
                    if (err) return callback(false);
                    callback(results);
                });
            }
        });
        
    },

    deleteOrga: function (siren, callback) {
        var sql = mysql.format("UPDATE UTILISATEUR SET type = 1 WHERE mail IN ( SELECT a.mail FROM UTILISATEUR u INNER JOIN APPARTENIR_ORGA a ON u.mail = a.mail WHERE organisation =? AND u.type=2 GROUP BY a.mail HAVING COUNT(*) = 1 )");
        var sql2 = mysql.format("DELETE FROM ORGANISATION WHERE siren=?");
        //this.deleteOffre(siren); plus besoin car DELETE CASCADE
        db.query(sql, siren, function (err, results) {
            if (affectedRows.results == 0) {
                return callback(false);
            }else{
                db.query(sql2, siren, function (err, results) {
                    if (results.affectedRows > 0){
                        callback(true);
                    }else{
                        callback(false);
                    }
                });
            }
        });
    },
            

    readAllOrgaRecruteur: function (mail, callback) {
        db.query("SELECT * FROM APPARTENIR_ORGA a INNER JOIN ORGANISATION o ON a.organisation=o.siren WHERE a.mail=?", mail, function
            (err, results) {
                if (err) return callback(false);
                callback(results);
        });
    }
}
