var express = require('express');
var router = express.Router();
var orgaModel = require('../Modele/Organisation.js')
var candidatModel = require('../Modele/Candidat.js')

router.get('/devenirRecruteur', function (req, res, next) {

  result = orgaModel.readOrga(function (result) {
    result2 = candidatModel.readUserDmdRecruteur(function (result2) {
      console.log(result2);
    res.render('formulaire_recruteur', {demandeRecrut : result2, organisation : result});
    });
  });
});


router.post('/devenirRecruteur', function (req, res, next) {
  console.log("debut");
  console.log(req.body);
  console.log("k");
    if (req.body.form1 !== undefined) {
    var mail = "oceane@etu";
    var siren = req.body.choix; //renvoie le siren
    console.log(siren);
        candidatModel.creatDmdRecruteur(mail, siren, function (result) {
          console.log(result);
          if (result) {
            console.log("ok");
            res.redirect('/recrut/devenirRecruteur');
          } else {
            console.log("pas ok");
            res.redirect('/recrut/devenirRecruteur');
          }
        });
      }
      else if (req.body.form2 !== undefined) {
        var mail = "oceane@etu";
        candidatModel.creatDmdAdmin(mail, function (result) {
          console.log(result);
          if (result) {
            res.redirect('/recrut/devenirRecruteur');
          } else {
            res.render('formulaire_recruteur');
          }
        });
      }
  else{
    console.log("erreur");
    res.redirect('/recrut/devenirRecruteur');
  }
});
  


module.exports = router;