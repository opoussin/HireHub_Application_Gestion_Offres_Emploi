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
updateDmdAdmin
updateDmdRecruteur
*/
var db = require('./db.js');
var mysql = require('mysql');


module.exports = {
    //jamais utilisée
    readUser: function (mail, callback) {
        db.query("select * from UTILISATEUR where mail= ?", mail, function
            (err, results) {
            if (err) return callback(null);
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
        db.query("UPDATE UTILISATEUR SET statut=0 WHERE mail=?", mail, function (err, results) {
          if (results.affectedRows == 0) {
            //console.log("erreur", err);
            return callback(false); // Passer l'erreur au callback
          }
          callback(true); // Appeler le callback sans résultats
        });
      },
      

    enableUser: function (mail, callback) {
        db.query("UPDATE UTILISATEUR SET statut=1 WHERE mail=?", mail, function
            (err, results) {
                if (results.affectedRows == 0) {
                    //console.log("erreur", err);
                    return callback(false); // Passer l'erreur au callback
                  }
                  callback(true); // Appeler le callback sans résultats
                });
    },

    acceptAdmin: function (mail, callback) {
        db.query("UPDATE UTILISATEUR SET type=3 WHERE mail=?", mail, function
            (err, results) {
                if (results.affectedRows == 0) {
                    return callback(false); 
                  }
                  callback(true); 
                });
    },

    creatOrga: function (nom, siren, type, siegesocial, callback) {
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

    acceptOrga: function (nom, siren, type, siegesocial, mail, value, callback) {
        let self = this;
        this.readOrgaSiren(siren, function(result){
            if(result){
                self.creatOrga(nom,siren,type,siegesocial, function(result){
                    self.acceptRecruteur(mail,siren, function(result){
                        self.updateDmdOrga(siren, mail, value, function(result){
                                callback(true);
                        });
                    });
                    
                });
            }
            else{
                callback(false);
            }
        });
    },

    acceptRecruteur: function (mail, siren, callback) {
        sql = "SELECT * FROM APPARTENIR_ORGA WHERE organisation = ? AND mail = ?";
        db.query(sql, [siren, mail], function (err, rows) {
          if (err) throw err;
          if (rows.length !== 0) {
            callback(false);
          } else {
            var sql2 = mysql.format("INSERT INTO APPARTENIR_ORGA (mail, organisation) VALUES (?,?)", [mail, siren]);
            db.query(sql2, function (err, result) {
              if (err) throw err;
              callback(result);
            });
          }
        });
      },
      
      
    readDmdOrga: function (status,callback) {
        db.query("select * from DMD_ORGA WHERE statut=?",status, function
        (err, results) {
        if (err) throw err;
        callback(results);
        });
    },
    readDmdAdmin: function (status, callback) {
        db.query("select * from DMD_ADMIN WHERE statut=?", status, function
        (err, results) {
        if (err) throw err;
        callback(results);
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
        db.query("select * from DMD_ADMIN ",  function
        (err, results) {
        if (err) throw err;
        callback(results);
        });
    },

    readUserFiltre: function (mail, nom, prenom, date, type, statut, callback) {
        //console.log("mail" + mail + "nom" + nom + "prenom" + prenom + "date" + date);
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
            //console.log(sql);
            //console.log("results", results);
            callback(results);
        });


    },

    updateDmdAdmin: function (mail, value, callback) {
        if(value){
            db.query("UPDATE DMD_ADMIN SET statut='Validé' WHERE utilisateur=?", mail , function
            (err, results) {
                if (results.affectedRows == 0) {
                    return callback(false); 
                  }
                  callback(true); 
        });
        }
        else{
            db.query("UPDATE DMD_ADMIN SET statut='Refusé' WHERE utilisateur=?", mail, function
            (err, results) {
                if (results.affectedRows == 0) {
                    return callback(false); 
                  }
                  callback(true); 
        });
        }
        
    },
    updateDmdOrga: function (siren, mail, value, callback) {
        if(value==1){
            db.query("UPDATE DMD_ORGA SET statut='Validé' WHERE siren=? AND recruteur=?", [siren,mail] , function
            (err, results) {
                if (results.affectedRows == 0) {
                    return callback(false); 
                  }
                  callback(true); 
            });
        }
        else{
            db.query("UPDATE DMD_ORGA SET statut='Refusé' WHERE siren=? AND recruteur=?", [siren,mail] , function
            (err, results) {
                if (results.affectedRows == 0) {
                    return callback(false); 
                  }
                  callback(true); 
            });
        
        }
        
    },
    updateDmdRecruteur: function (siren, mail, value, callback) {
        if(value==1){
            db.query("UPDATE DMD_RECRUTEUR SET statut='Validé' WHERE organisation=? AND recruteur=?", [siren,mail] , function
            (err, results) {
                if (results.affectedRows == 0) {
                    return callback(false); 
                  }
                  callback(true); 
        });
        }
        else{
            db.query("UPDATE DMD_RECRUTEUR SET statut='Refusé' WHERE organisation=? AND recruteur=?", [siren,mail] , function
            (err, results) {
                if (results.affectedRows == 0) {
                    return callback(false); 
                  }
                  callback(true); 
        });
        }
        
    },
}
