var express = require('express');
var router = express.Router();
var orgaModel = require('../Modele/Organisation.js')
var candidatModel = require('../Modele/Candidat.js')
var communModel = require('../Modele/Commun.js')
var recruteurModel = require('../Modele/Recruteur.js');
const { urlencoded } = require('express');

router.get('/recruteur', function (req, res, next) {
    var siren=req.session.orga;
    var mail=req.session.userid;
    req.session.current_profil=2;
    result = recruteurModel.readAllOffreOrga (siren, function (results) {
    res.render('recruteur', {listeOffre: results , req : req});
  });
  
});

router.get('/creer_offre', function (req, res, next) {
    var siren=req.session.orga;
    var mail=req.session.userid;
   
    res.render('creer_offre', {req : req});
});

router.post('/creer_offre', function (req, res, next) {
  // Récupération des données du formulaire
    var etat = req.body.etat;
    var dateValidite = req.body.dateValidite;
    var pieces = req.body.pieces;
    var nombrePieces = req.body.nombrePieces;
    var intitule = req.body.intitule;
    var statut = req.body.statut;
    var responsable = req.body.responsable;
    var type = req.body.type;
    var lieu = req.body.lieu;
    var rythme = req.body.rythme;
    var salaire = req.body.salaire;
    var description = req.body.description;
    var etat = req.body.etat;
    var organisation = req.session.orga;

  // Appel à la fonction creat du modèle Utilisateur
  recruteurModel.creatOffre(organisation, etat, dateValidite, pieces, nombrePieces, intitule, statut, responsable, type, lieu, rythme, salaire, description, function (result) {
    if (result){ //result = vrai donc il y a une erreur
      res.redirect('./recruteur');
    }
    else{
      res.redirect('./recruteur');
    }
  });
});

router.get('/logout',(req,res) => {
  req.session.destroy();
  res.redirect('/');
});

router.get('/supp_offre/:numero', function (req, res, next) {
  let numero = req.params.numero;
  console.log( " numeor a supp ", numero)
    recruteurModel.deleteOffre(numero, function (result) {
      if (result) {
        console.log ("suppression réussie");
        res.redirect('/recrut/recruteur');
      } else {
        res.redirect('/recrut/recruteur');
      }
    });
 
});


router.get('/editer_offre/:numero', function (req, res, next) {
  let numero = req.params.numero;
    recruteurModel.readOffre(numero, function (result) {
      if (result) {
        res.render('editer_offre', {offre: result , req : req});
      } else {
        res.redirect('/recrut/recruteur');
      }
    });
 
});

router.post('/editer_offre', function (req, res, next) {
  if (req.body){
    var etat = req.body.etat;
    var dateValidite = req.body.dateValidite;
    var pieces = req.body.pieces;
    var nombrePieces = req.body.nombrePieces;
    var numero = req.body.numero;
    var intitule = req.body.intitule;
    var statut = req.body.statut;
    var responsable = req.body.responsable;
    var type = req.body.type;
    var lieu = req.body.lieu;
    var rythme = req.body.rythme;
    var salaire = req.body.salaire;
    var description = req.body.description;
    
    recruteur.Model.updateOffre(etat, dateValidite, pieces, nombrePieces, numero, function (result) {
      recruteur.Model.updateFiche(intitule, statut, responsable, type, lieu, rythme, salaire, description, numero, function (result){
        res.redirect('/recrut/recruteur');
        console.log("update success");
      }); 
    });
  }
  res.redirect('/recrut/recruteur');
});

router.get('/profil_recruteur', function (req, res, next) {
    var mail=req.session.userid;
    var siren = req.session.orga;
    communModel.readUser(mail, function (user) {
      candidatModel.readOrga(siren, function (result) {
        res.render('profil_recruteur', { user: user, orga: result , req : req});
        });
    });
  
});

module.exports = router;
