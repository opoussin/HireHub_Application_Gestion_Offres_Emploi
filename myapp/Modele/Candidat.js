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

module.exports = {
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