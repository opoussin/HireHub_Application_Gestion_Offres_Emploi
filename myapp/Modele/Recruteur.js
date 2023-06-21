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

const db = require('./db.js');
const mysql = require('mysql');

module.exports = {
    creatFiche: function (numero, intitule, statut, responsable, type, lieu, rythme, salaire, description, callback) {
        let sql = mysql.format("INSERT INTO FICHE_POSTE (offre, intitule, statut, responsable, type, lieu, rythme, salaire, description) VALUES (?,?,?,?,?,?,?,?,?)", [numero, intitule, statut, responsable, type, lieu, rythme, salaire, description]);
        db.query(sql, function (err, results) {
            if (err) return callback(false);
            if (results.affectedRows == 0) {
                callback(false);
            }else{
                callback(true);
            }
        });
    },
    creatOffre: function (organisation, etat, dateValidite, pieces, nombrePieces, intitule, statut, responsable, type, lieu, rythme, salaire, description, callback) {
        let sql = mysql.format("INSERT INTO OFFRE (organisation, etat, dateValidite, pieces, nombrePieces) VALUES (?,?,?,?,?)", [organisation, etat, dateValidite, pieces, nombrePieces]);
        let self = this;
        //let numero = 0;
        db.query(sql, function (err, results) {
            if (err) {
                return callback(false);
            }else{
            
                let sql2 = "SELECT numero FROM OFFRE ORDER BY numero DESC LIMIT 1";
                db.query(sql2, function (err, results) {

                    if (err) {
                        return callback(false);
                    }
                    let numero = results[0].numero;
                    self.creatFiche(numero, intitule, statut, responsable, type, lieu, rythme, salaire, description, callback);
                });
            }
        });
    },
    
    deleteOffre: function (numero, callback) {
        db.query("DELETE FROM OFFRE WHERE numero=?", numero, function (err, results){
            if (err) {return callback(false);
            }else{
                callback(true);
            }
        });
    },

    deleteFiche: function (offre, callback) {
        let sql = mysql.format("DELETE FROM FICHE_POSTE WHERE offre=?");
        db.query(sql, offre, function (err, results) {
            if (err) return callback(false);
            if (results.affectedRows == 0) {
                return callback(false);
            }else{
                callback(true);
            }
        });
    },
    
    updateOrga: function (nom, type, siegeSocial, siren, callback) {
        let sql = mysql.format("UPDATE UTILISATEUR SET nom =?, type=?, siegeSocial=? WHERE siren=?", [nom, type, siegeSocial, siren]);
        db.query(sql, function (err, results) {
            if (err) return callback(false);
            if (results.affectedRows == 0) {
                return callback(false);
            }else{
                callback(true);
            }
        });

    },
    updateOffre: function (etat, dateValidite, pieces, nombrePieces, numero, callback) {
        let sql = mysql.format("UPDATE OFFRE SET etat=?, dateValidite=?, pieces=?, nombrePieces=? WHERE numero=?", [etat, dateValidite, pieces, nombrePieces, numero]);
        
        db.query(sql, function (err, results) {
            if (err) return callback(false);
            if (results.affectedRows == 0) {
                return callback(false);
            }else{
                callback(true);
            }
        });
    },
    readAllCandidat: function (numero, callback) {
        db.query("SELECT * FROM CANDIDATURE c INNER JOIN UTILISATEUR u ON c.candidat=u.mail WHERE c.offre =?", numero, function (err, results) {
            if (err) {
                return callback(false);
            }else{
                callback(results);
            }
        });
    },
    readAllOffreOrga: function (siren, callback) {
        sql = "SELECT * FROM OFFRE o INNER JOIN ORGANISATION org ON o.organisation=org.siren INNER JOIN FICHE_POSTE f ON f.offre = o.numero WHERE siren = ?";
        db.query(sql, siren, function (err, results) {
            if (err) return callback(false);
            callback(results);
        });
    },

    readAllOffreOrgaRecrut: function (mail, orga, intitule, date, o_exp, callback) {
        let sql = "SELECT * FROM OFFRE o INNER JOIN ORGANISATION org ON o.organisation=org.siren INNER JOIN FICHE_POSTE f ON f.offre = o.numero INNER JOIN APPARTENIR_ORGA a ON a.organisation=o.organisation WHERE mail = ?";
        if ( orga !== undefined && orga !== "") {
            sql += ` AND org.siren=${orga}`;
        }
        if ( intitule !== undefined && intitule !== "") {
            sql += ` AND f.intitule like "%${intitule}%"`;
        }
        if ( date !== undefined && date !== "") {
            sql += ` AND  CAST(o.dateValidite as DATE)="${date}"`;
        }
        if ( o_exp) {
            sql += ` AND  o.dateValidite < CURRENT_DATE`;
        }

        sql +=' ORDER BY o.numero DESC';
        db.query(sql, mail, function (err, results) {
            if (err) return callback(false);
            callback(results);
        });
    },

    readOffre: function (numero, callback) {
        sql = "SELECT * FROM OFFRE o INNER JOIN FICHE_POSTE f ON f.offre = o.numero WHERE numero = ?";
        db.query(sql, numero, function (err, results) {
            if (err){ return callback(false);
            }else{
                callback(results);
            }
        });
    },
    updateOffreEtat: function (etat, numero, organisation, callback) {
        let sql = mysql.format("UPDATE OFFRE SET  etat=? WHERE numero=? AND organisation= ?", [etat, numero, organisation]);
        db.query(sql, function (err, results) {
            if (err) return callback(false);
            if (results.affectedRows == 0) {
                return callback(false);
            }else{
                callback(true);
            }
        });
    },
    
    updateFiche: function (intitule, statut, responsable, type, lieu, rythme, salaire, description, offre, callback) {
        let sql = mysql.format("UPDATE FICHE_POSTE SET intitule=?, statut=?, responsable=?, type=?, lieu=?, rythme=?, salaire=?, description=? WHERE offre=?", [intitule, statut, responsable, type, lieu, rythme, salaire, description, offre]);
        db.query(sql, function (err, results) {

            if (err) return callback(false);
            if (results.affectedRows == 0) {
                return callback(false);
            }else{
                callback(true);
            }
        });
    },
    acceptCandidat: function (numero, mail, callback) {
        let sql = mysql.format("UPDATE CANDIDATURE SET etatC=1 WHERE offre =? AND candidat=?", [numero, mail]);
        db.query(sql, function (err, result) {
            if (err) return callback(false);
            if (result.affectedRows == 0) {
                return callback(false);
            }else{
                callback(true);
            }
        });
    },
    refuseCandidat: function (numero, mail, callback) {
        let sql = mysql.format("UPDATE CANDIDATURE SET etatC=2 WHERE offre =? AND candidat=?", [numero, mail]);
        db.query(sql, function (err, result) {
            if (err) return callback(false);
            if (result.affectedRows == 0) {
                return callback(false);
            }else{
                callback(true);
            }
        });
    },
    readAllDmdRecruteur: function (siren, siren_choix, date, mail, callback) {
        let sql = mysql.format("SELECT * FROM UTILISATEUR u INNER JOIN DMD_RECRUTEUR r ON u.mail=r.recruteur INNER JOIN ORGANISATION o ON o.siren=r.organisation");
        if(siren!= undefined && siren.length > 0){
            sql += ` WHERE (`
            for(i = 0; i<siren.length; i++){
                sql += ` r.organisation = ${siren[i].siren}`
                if (i < siren.length - 1){
                    sql += ` OR`
                };
            };
            sql+= `)`
            if ( siren_choix !== undefined && siren_choix !== "") {            
                sql += ` AND  r.organisation like "%${siren_choix}%"`;
            }
            if ( mail !== undefined && mail !== "") {            
                sql += ` AND  u.mail like "%${mail}%"`;
            }
            if ( date !== undefined && date !== "") {
                sql += ` AND  CAST(date as DATE)="${date}"`;
            }
        };
        db.query(sql, function (err, results) {
            if (err) return callback(false);
            callback(results);
        });
    },


    /*quitter une organisation */
    deleteRecruteurOrga: function (siren, mail, callback) {
        let sql = mysql.format("UPDATE UTILISATEUR SET type = 1 WHERE mail IN ( SELECT u.mail FROM UTILISATEUR u INNER JOIN APPARTENIR_ORGA a ON u.mail = a.utilisateur WHERE a.organisation =? AND u.mail=? GROUP BY utilisateur HAVING COUNT(*) = 1 )",[siren,mail]);
        let sql2 = mysql.format("DELETE FROM APPARTENIR_ORGA WHERE organisation=? AND utilisateur=mail", siren);
        db.query(sql, function (err, results) {
            if (err) return callback(false);
            if (results.affectedRows == 0) {
                return callback(false);
            }else{
                db.query(sql2, function (err, results) {
                    if (err) return callback(false);
                    if (results.affectedRows == 0) return callback(false);
                    callback(results);
                });
            }
        });
        
    },

    deleteOrga: function (siren, callback) {
        let sql = mysql.format("DELETE FROM ORGANISATION WHERE siren=?");
        db.query(sql, siren, function (err, results) {
            if (err) return callback(false);
            if (results.affectedRows > 0){
                callback(true);
            }else{
                callback(false);
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
