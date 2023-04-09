var db = require('./db.js');
module.exports = {
    read: function (mail, callback) {


        db.query("select * from UTILISATEUR where mail= ?", mail, function
            (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    readAll: function (callback) {
        db.query("select * from UTILISATEUR", function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    areValid: function (mail, mdp, callback) {
        sql = "SELECT mdp FROM UTILISATEUR WHERE mail = ?";
        rows = db.query(sql, mail, function (err, results) {
            if (err) throw err;
            if (rows.length == 1 && rows[0].mdp === mdp) {
                callback(true)
            } else {
                callback(false);
            }
        });
    },
    creat: function (mail, nom, prenom, mdp, telephone, callback) {
        var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        var sql = mysql.format("INSERT INTO UTILISATEUR VALUES (?,?,?,?,?,?)", [mail, nom, prenom, mdp, telephone, date]);

        db.query(sql, function (err, results) {
                if (err) throw err;
                callback(results);
            });
    },
    areRecruteur: function (mail, callback) {
        sql = "SELECT Type FROM UTILISATEUR WHERE mail = ?";
        rows = db.query(sql, mail, function (err, results) {
            if (err) throw err;
            if (rows.length == 1 && rows[0].type === 2) {
                callback(true)
            } else {
                callback(false);
            }
        });
    },
    areAdmin: function (mail, callback) {
        sql = "SELECT Type FROM USERS WHERE mail = ?";
        rows = db.query(sql, mail, function (err, results) {
            if (err) throw err;
            if (rows.length == 1 && rows[0].type === 3) {
                callback(true)
            } else {
                callback(false);
            }
        });
    },
    update: function (mail, nom, prenom, telephone, callback) {
        /* if (result(email)||email==NULL){
            throw err;
        }else{ */
        var sql = mysql.format("UPDATE UTILISATEUR SET nom =?, prenom=?, telephone=? WHERE mail=?", [nom, prenom, telephone, mail]);

        db.query(sql, function (err, results) {
                if (err) throw err;
                callback(results);
            });
        //}
    },
    
}
