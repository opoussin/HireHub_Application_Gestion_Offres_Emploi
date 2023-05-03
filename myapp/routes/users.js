var express = require('express');
var router = express.Router();
var candidatModel = require('../Modele/Candidat.js')
var communModel = require('../Modele/Commun.js')
var Model = require('../Modele/user.js')

router.get('/userslist', function (req, res, next) {
  result = Model.readall(function (result) {
    res.render('usersList', {
      title: 'List des utilisateurs', users:
        result
    });
  });
});


router.get('/profil_candidat', function (req, res, next) {
  if(req.session.userid){
    var mail=req.session.userid;
    result = communModel.readUser(mail, function (user) {
    result = candidatModel.readAllCandidature(mail, function (result) {
      res.render('profil_candidat', { user: user, candidatures: result });
      });
    });
    }else
    res.render('connexion');
  
});


router.get('/modifier_profil', function (req, res, next) {
 
  if(req.session.userid){
    var mail=req.session.userid;
    result = communModel.readUser(mail, function (result) {
      console.dir(result);
      res.render('modifier_profil', { nom: result.nom, prenom: result.prenom, mail: result.mail, mdp: result.mdp, telephone: result.telephone, statut: result.statut, date: result.dateCreation.toLocaleDateString("fr") });
    });
    }else
    res.render('connexion');
});

router.post('/modifier_profil', function (req, res, next) {
  var mail=req.session.userid;
  //if (req.body.nom||req.body.prenom||req.body.telephone) {
    if (req.body.form1){

    console.log("body:");
    console.log(req.body);
    var nom = req.body.nom;
    var prenom = req.body.prenom;
    var telephone = req.body.telephone;
    //var mail = req.body.mail;
    candidatModel.updateUser(mail, nom, prenom, telephone, function (result) {
      //console.log(result);
      /*if (result) {
        //console.log("update oui");
        res.redirect('/users/profil_candidat');
      } else {
        res.render('connexion');
      }*/
      console.log("apres query");
      res.redirect('/users/profil_candidat');
    });
  }
  if (req.body.form2) {
    var mdp1 = req.body.mdp1;
    var mdp2 = req.body.mdp2;
    candidatModel.updateUserMdp(mdp1, mdp2, mail, function (result) {
      if (result) {
        res.redirect('/users/profil_candidat');
      } else {
        res.render('connexion');
      }
    });
  }
  res.redirect('/users/profil_candidat');
});

router.get('/administrateur', function (req, res, next) {
  res.render('admin');
});

router.get('/devenirAdministrateur', function (req, res, next) {
  if(req.session.userid){
    res.render('formulaire_admin');
    }else
    res.render('connexion');
});

router.post('/devenirAdministrateur', function (req, res, next) {
  var mail = req.body.mail;
  candidatModel.creatDmdAdmin(mail, function (result) {
    res.redirect('/admin');
  });
});

router.get('/recruteur', function (req, res, next) {
  res.render('recruteur');
});

router.get('/devenirRecruteur', function (req, res, next) {
  if(req.session.userid){
    res.render('formulaire_recruteur');
    }else
    res.render('connexion');
});

router.post('/devenirRecruteur', function (req, res, next) {
  var mail = req.body.mail;
  var siren = req.body.siren;

  candidatModel.creatDmdRecruteur(siren, mail, function (result) {
    res.redirect('/admin');
  });
});
router.get('/candidat', function (req, res, next) { 
 
    if(req.session.userid){
      result = candidatModel.readAllOffreValide (function (results) {
      res.render('candidat', { title: 'List des Offres', listeOffre: results });
    });
    }else
    res.redirect('/connexion');

});
/*router.get('/candidat', function (organisation, lieu, statut, salaire, type, intitule,req, res, next) { 
  result = candidatModel.readAllOffreFiltre (function (organisation, lieu, statut, salaire, type, intitule, result) {
    res.render('candidat', { title: 'List des Offres Filtres', users: result });
  });
});*/
/*
if(req.session.userid){
    var mail=req.session.userid;
    
    }else
    res.render('connexion');
*/

module.exports = router;