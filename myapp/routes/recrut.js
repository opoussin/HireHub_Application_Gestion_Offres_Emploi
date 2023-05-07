var express = require('express');
var router = express.Router();
var orgaModel = require('../Modele/Organisation.js')
var candidatModel = require('../Modele/Candidat.js')
var communModel = require('../Modele/Commun.js')
var recruteurModel = require('../Modele/Recruteur.js')

router.get('/demandes', function (req, res, next) {
  var mail=req.session.userid;
  if(req.session.userid){
  
    candidatModel.readUserDmdRecruteur(mail, function (result) {
    //console.log("result:");
    //console.log(result);
    orgaModel.readOrga(function (orgaResult) {
      //console.log("orgaResult:");
      //console.log(orgaResult);
      candidatModel.readUserDmdAdmin(mail, function (adminResult) {
        //console.log("adminResult:");
        //console.log(adminResult);
        if (adminResult.length > 0 && (adminResult[0].statut === "En attente" || adminResult[0].statut === "Validé")) {
          autorisation = false;
        } else {
          autorisation = true;
        }
        
        result ??= [];
        orgaResult ??= [];
        adminResult ??= [];
        res.render('formulaire_recruteur', {autorisation, demandeRecrut: result, organisation: orgaResult, demandeAdmin: adminResult });
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



router.post('/demandes/recruteur', function (req, res, next) {
  var mail=req.session.userid;

    var siren = req.body.choix; //renvoie le siren
    recrutModel.readAllDmdRecruteur(siren, function (resultDmd) {
      if(resultDmd )
    candidatModel.creatDmdRecruteur(mail, siren, function (result) {
      console.log(result);
      if (result) {
        res.redirect('/recrut/demandes');
      } else {
        res.redirect('/recrut/demandes');
      }
    });
  });

});

router.post('/demandes/admin', function (req, res, next) {
  var mail=req.session.userid;
  
    candidatModel.creatDmdAdmin(mail, function (result) {
      if (result) {
        res.redirect('/recrut/demandes');
      } else {
        res.redirect('/recrut/demandes');
      }
    });
 
});
router.post('/demandes/adminSupp', function (req, res, next) {
  var mail=req.session.userid;
  var date = req.body.dmdA;
  console.log("date: ");
  console.log(date);
    candidatModel.deleteDmdAdmin(mail, date, function (result) {
      if (result) {
        res.redirect('/recrut/demandes');
      } else {
        res.redirect('/recrut/demandes');
      }
    });
 
});
router.get('/demandes/recruteurSupp/:siren', function (req, res, next) {
  var mail= req.session.userid;
  let siren = req.params.siren;
    candidatModel.deleteDmdRecruteurOrga(mail, siren, function (result) {
      if (result) {
        res.redirect('/recrut/demandes');
      } else {
        res.redirect('/recrut/demandes');
      }
    });
 
});

router.get('/recruteur', function (req, res, next) {
  if(req.session.userid||communModel.areRecruteur(req.session.userid)){
    var siren=req.session.orga;
    result = recruteurModel.readAllOffreOrga (siren, function (results) {
    res.render('recruteur', { title: 'List des Offres', listeOffre: results });
  });
  }
  else if (!communModel.areRecruteur(req.session.userid)){
    res.redirect('/users/candidat');
  }else{
  res.redirect('/connexion');
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
