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
    readUser: function (mail, callback) {
        db.query("select * from UTILISATEUR where mail= ?", mail, function
            (err, results) {
            if (err) return callback(false);
            callback(results);
        });
    },
    readAllUser: function (callback) {
        db.query("select * from UTILISATEUR", function (err, results) {
            if (err) return callback(false);
            callback(results);
        });
    },
 
    disableUser: function (mail, callback) {
        db.query("UPDATE UTILISATEUR SET statut=0 WHERE mail=?", mail, function
            (err, results) {
                if (results.affectedRows == 0) {
                    return callback(false); 
                  }
                  callback(true);
                });
    },
      

    enableUser: function (mail, callback) {
        db.query("UPDATE UTILISATEUR SET statut=1 WHERE mail=?", mail, function
            (err, results) {
                if (results.affectedRows == 0) {
                    return callback(false); 
                }
                  callback(true); 
                });
    },

    acceptAdmin: function (mail, callback) {
        db.query("UPDATE UTILISATEUR SET type=3 WHERE mail=?", mail, function
            (err, results) {
                if (results == undefined || results.affectedRows == 0) {
                    return callback(false); 
                }
                  callback(true); 
                });
    },

    creatOrga: function (nom, siren, type, siegesocial, callback) {
        db.query("INSERT INTO ORGANISATION (nom, siren, type, siegesocial) VALUES (?,?,?,?)", [nom, siren, type, siegesocial], function
            (err, results) {
                if (err) {
                    return callback(false); 
                }
                  return callback(true); 
                });
    },

    readOrgaSiren : function ( siren, callback){
        db.query("select * from ORGANISATION where siren= ?", siren, function
            (err, results) {
            if (err) return callback(false);
            callback(results);
        });
    },

    acceptOrga: function (nom, siren, type, siegesocial, mail, value, callback) {
        let self = this;
        this.readOrgaSiren(siren, function(result){
            if(result){
                self.creatOrga(nom,siren,type,siegesocial, function(result){
                    if(result){
                        self.acceptRecruteur(mail,siren, function(result){
                            if(result){
                                self.updateDmdOrga(siren, mail, value, function(result){
                                    if(result){
                                        callback(true);
                                    }
                                });
                            }
                        });
                    }
                    
                });
            }
            callback(false);
            
        });
    },

    acceptRecruteur: function (mail, siren, callback) {
        sql = "SELECT * FROM APPARTENIR_ORGA WHERE organisation = ? AND mail = ?";
        db.query(sql, [siren, mail], function (err, rows) {
          if (err) return callback(false);
          if (rows.length !== 0) {
            callback(false);
          } else {
            var sql2 = mysql.format("INSERT INTO APPARTENIR_ORGA (mail, organisation) VALUES (?,?)", [mail, siren]);
            db.query(sql2, function (err, result) {
              if (err) return callback(false);
              callback(true);
            });
          }
        });
      },
      
      
    readDmdOrga: function (statut,mail, date,callback) {
        var sql=mysql.format("select * from DMD_ORGA WHERE statut=?");
        if ( mail !== undefined && mail !== "") {            
            sql += ` AND  recruteur like "%${mail}%"`;
        }
        if ( date !== undefined && date !== "") {
            sql += ` AND  CAST(dateCreation as DATE)="${date}"`;
        }
        db.query(sql, statut, function (err, results) {
            if(err) {console.log(err); return callback(false);}
            callback(results);
        });
    },
    readDmdAdmin: function (statut, mail, date, callback) {
        var sql = mysql.format("select * from DMD_ADMIN WHERE statut=?");
        if ( mail !== undefined && mail !== "") {            
            sql += ` AND  utilisateur like "%${mail}%"`;
        }
        if ( date !== undefined && date !== "") {
            sql += ` AND  CAST(dateCreation as DATE)="${date}"`;
        }
        db.query(sql, statut, function (err, results) {
            if(err) {console.log(err); return callback(false);}
            callback(results);
        });
    },
    readAllDmdOrga: function (mail, date,callback) {
        var sql = mysql.format("select * from DMD_ORGA WHERE 1");
        if ( mail !== undefined && mail !== "") {            
            sql += ` AND  recruteur like "%${mail}%"`;
        }
        if ( date !== undefined && date !== "") {
            sql += ` AND  CAST(dateCreation as DATE)="${date}"`;
        }

        db.query(sql, function (err, results) {
            if(err) {console.log(err); return callback(false);}
            callback(results);
        });
    },
    readAllDmdAdmin: function (mail, date, callback) {
        var sql = mysql.format("select * from DMD_ADMIN WHERE 1");
        if ( mail !== undefined && mail !== "") {            
            sql += ` AND  utilisateur like "%${mail}%"`;
        }
        if ( date !== undefined && date !== "") {
            sql += ` AND  CAST(dateCreation as DATE)="${date}"`;
        }

        db.query(sql, function (err, results) {
            if(err) {console.log(err); return callback(false);}
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
            if(err) {console.log(err); return callback(false);}
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
        if(value){
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
                     callback(false); 
                  }else{
                    callback(true);
                  } 
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
