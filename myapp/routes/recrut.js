var express = require('express');
var router = express.Router();
var orgaModel = require('../Modele/Organisation.js')
var candidatModel = require('../Modele/Candidat.js')

router.get('/devenirRecruteur', function (req, res, next) {
  var mail = "oceane@etu";
  candidatModel.readUserDmdRecruteur(mail, function (result) {
    console.log("result:");
    console.log(result);
    orgaModel.readOrga(function (orgaResult) {
      console.log("orgaResult:");
      console.log(orgaResult);
      res.render('formulaire_recruteur', { demandeRecrut: result, organisation: orgaResult });
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
  else {
    console.log("erreur");
    res.redirect('/recrut/devenirRecruteur');
  }
});



module.exports = router;