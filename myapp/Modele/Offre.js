var db = require('./db.js'); //pour la connexion

module.exports = {
    creat: function (Numero, Organisation, Etat, DateValidite, Pieces, NombrePieces, callback) {
        var sql = mysql.format("INSERT INTO OFFRE VALUES (?, ?, ?, ?, ?, ?)", [Numero, Organisation, Etat, DateValidite, Pieces, NombrePieces]);
        db.query(sql, function (err, result) {
            if (err) throw err;
            callback(results);
        });
        callback(false);
    },
    readAll: function ( callback) { // toutes les offres
        db.query("select * from OFFRE", function (err, results) {
            if (err) throw err;
                callback(results);
        });
        
    },

    readType: function(lieu, callback){ // trouver une orga par son nom 
        sql = "SELECT * FROM FICHE_OFFRE f INNER JOIN OFFRE o ON  f.Offre=o.Numero WHERE f.Lieu= ?";
        rows = db.query(sql,[nom,siren], function (err, results) {
            if (err) throw err;
            if (rows.length != 0) { 
                callback(true)
            } else {
                callback(false);
            }
        });
    }

}

