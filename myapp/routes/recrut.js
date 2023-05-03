var express = require('express');
var router = express.Router();
var orgaModel = require('../Modele/Organisation.js')
var candidatModel = require('../Modele/Candidat.js')
var communModel = require('../Modele/Commun.js')

router.get('/demandes', function (req, res, next) {
  if(req.session.userid&&communModel.areRecruteur(req.session.userid)){
    var mail=req.session.userid;
    candidatModel.readUserDmdRecruteur(mail, function (result) {
    console.log("result:");
    console.log(result);
    orgaModel.readOrga(function (orgaResult) {
      console.log("orgaResult:");
      console.log(orgaResult);
      candidatModel.readUserDmdAdmin(mail, function (adminResult) {
        console.log("adminResult:");
        console.log(adminResult);
        res.render('formulaire_recruteur', { demandeRecrut: result, organisation: orgaResult, demandeAdmin: adminResult });
        });
      });
    });    

    }else{
    if(req.session.userid){
      req.session.destroy();
    }
    res.render('connexion');
  }
  
});



router.post('/demandes', function (req, res, next) {
  console.log("debut");
  console.log(req.body);
  console.log("k");
  var mail=req.session.userid;
  if (req.body.form1 !== undefined) {
    var siren = req.body.choix; //renvoie le siren
    console.log(siren);
    candidatModel.creatDmdRecruteur(mail, siren, function (result) {
      console.log(result);
      if (result) {
        console.log("ok");
        res.redirect('/recrut/demandes');
      } else {
        console.log("pas ok");
        res.redirect('/recrut/demandes');
      }
    });
  }
  else if (req.body.form2 !== undefined) {
    candidatModel.creatDmdAdmin(mail, function (result) {
      console.log(result);
      if (result) {
        res.redirect('/recrut/demandes');
      } else {
        res.render('formulaire_recruteur');
      }
    });
  }
  else {
    console.log("erreur");
    res.redirect('/recrut/demandes');
  }
});


/*
if(req.session.userid||communModel.areRecruteur(req.session.userid)){
    var mail=req.session.userid;
    

    }else{
    if(req.session.userid){
      req.session.destroy();
    }
    res.render('connexion');
  }
*/
module.exports = router;