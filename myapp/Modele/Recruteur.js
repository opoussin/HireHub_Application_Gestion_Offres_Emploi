/*
RECRUTEUR
updateOrga 
deleteOrga
creatOffre O
deleteOffre O
updateOffre
readAllCandidat
readAllOffreOrga
updateOffreEtat
creatFiche
deleteFiche
updateFiche
acceptCandidat
deleteRecruteurOrga
readAllDmdRecruteur
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
    deleteOffre: function (numero, callback) {
        var sql = mysql.format("DELETE FROM OFFRE WHERE numero=?");
        var sql2 = mysql.format("DELETE FROM FICHE_POSTE WHERE offre=?");

        db.query(sql, function (err, results) {
            if (err) throw err;
            callback(results);
        });
        db.query(sql2, function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    
}