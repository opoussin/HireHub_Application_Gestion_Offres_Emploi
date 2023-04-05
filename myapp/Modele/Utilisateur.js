var db = require('./db.js');
module.exports = {
    read: function (email, callback) {


        db.query("select * from Utilisateur where email= ?", email, function
            (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    readAll: function (callback) {
        db.query("select * from Utilisateur", function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    areValid: function (email, password, callback) {
        sql = "SELECT Mdp FROM USERS WHERE email = ?";
        rows = db.query(sql, email, function (err, results) {
            if (err) throw err;
            if (rows.length == 1 && rows[0].Mdp === password) {
                callback(true)
            } else {
                callback(false);
            }
        });
    },
    creat: function (email, nom, prenom, pwd, type, callback) {

        var sql = mysql.format("INSERT INTO UTILISATEUR VALUES (?,?,?,?,?,?)", [email, nom, prenom, pwd, telephone,time_stamp]);

        db.query(sql, function (err, result) {
                if (err) throw err;
                callback(results);
            });
        callback(false);
    },
    areRecruteur: function (email) {
        sql = "SELECT Type FROM USERS WHERE email = ?";
        rows = db.query(sql, email, function (err, results) {
            if (err) throw err;
            if (rows.length == 1 && rows[0].Type === 2) {
                callback(true)
            } else {
                callback(false);
            }
        });
    },
    areAdmin: function (email) {
        sql = "SELECT Type FROM USERS WHERE email = ?";
        rows = db.query(sql, email, function (err, results) {
            if (err) throw err;
            if (rows.length == 1 && rows[0].Type === 3) {
                callback(true)
            } else {
                callback(false);
            }
        });
    },
    update: function (email, nom, prenom, telephone, callback) {
        /* if (result(email)||email==NULL){
            throw err;
        }else{ */
        var sql = mysql.format("UPDATE UTILISATEUR SET Mail=?, Nom =?, Prenom=?, Telephone=? WHERE Mail=?", [nom, prenom, telephone, email]);

        db.query(sql, function (err, result) {
                if (err) throw err;
                callback(results);
            });
        callback(false);
        //}
    },
    
}
