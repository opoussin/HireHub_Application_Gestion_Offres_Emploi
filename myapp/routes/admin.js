var express = require('express');
var router = express.Router();
var adminModel = require('../Modele/Administrateur.js')
var communModel = require('../Modele/Commun.js')
var recrutModel = require('../Modele/Recruteur.js')
var userModel = require('../Modele/Utilisateur.js');
const { search } = require('./users.js');


  /*
if(req.session.userid||communModel.areAdmin(req.session.userid)){
    var mail=req.session.userid;
    

    }else{
    if(req.session.userid){
      req.session.destroy();
    }
    res.render('connexion');
  }
*/



router.get('/administrateur', function (req, res, next) {

  
    if (req.session.userid) {

      var mail = req.query.mail;
      var nom = req.query.nom;
      var prenom = req.query.prenom;
      var date = req.query.date;
      var statut = req.query.statut;
      var type = req.query.type;

      adminModel.readUserFiltre(mail, nom, prenom, date, type, statut, function (results) {
        res.render('admin', {userResult: results, req: req, search:{
          mail:mail, nom:nom, prenom:prenom, date:date, type:type, statut:statut
        } });
      });
    }else{
    res.redirect('/connexion');
    }
});

router.get('/administrateur/activer', function (req, res, next) {
  var mail = req.session.userid;
  
    var mail2 =req.query.user; 
    if(mail==mail2){    
      adminModel.enableUser(mail2, function (results) {
        res.redirect('/admin/administrateur')
      });
    }else{
      res.redirect('/admin/administrateur'); //ne peut pas se réactiver lui même
    }
});

router.get('/administrateur/desactiver', function (req, res, next) {
  var mail = req.session.userid;

    var mail2 =req.query.user;
      
      adminModel.disableUser(mail2, function (results) {
        res.redirect('/admin/administrateur')
      });
    
});

router.get('/administrateur/supprimer', function (req, res, next) {
  var mail = req.session.userid;

  
    var mail2 =req.query.user;
      
      communModel.deleteUser(mail2, function (results) {
        res.redirect('/admin/administrateur')
      });
});

router.get('/demandes', function (req, res, next) {
  var mail=req.session.userid;
  adminModel.readAllDmdAdmin(function (result) {  
    adminModel.readAllDmdOrga(function(orgaResult){
      res.render('admin_demandes', {demandeOrga: orgaResult, demandeAdmin: result,req : req});
    });
  });   
});

router.get('/demandes_admin/accept', function (req, res, next) {
  var mail= req.session.userid;
  let user = req.query.user;
  let value=true;
  adminModel.acceptAdmin(user, function (result) {
    adminModel.updateDmdAdmin(user, value, function (result) {

      res.redirect('/admin/demandes');
      
    });
  });
});

router.get('/demandes_admin/deny', function (req, res, next) {
  var mail= req.session.userid;
  let user = req.query.user;
  let value=false;
  
    adminModel.updateDmdAdmin(user, value, function (result) {

      res.redirect('/admin/demandes');
      
    });
});


router.get('/demandes_orga/accept', function (req, res, next) {
  var mail= req.session.userid;
  let siren = req.query.siren;
  let nom = req.query.nom;
  let type = req.query.type;
  let siege = req.query.siege;
  let user = req.query.user;

  let value=true;
  adminModel.acceptOrga(nom, siren, type, siege, mail, function (result) {
    adminModel.updateDmdOrga(siren, user, value, function (result) {

      res.render('admin_demandes');
      
    });
  });
});

router.get('/demandes_orga/deny', function (req, res, next) {
  let mail= req.session.userid;
  let siren = req.query.siren;
  let user = req.query.user;

  let value=false;
    adminModel.updateDmdOrga(siren, user, value, function (result) {

      res.redirect('/admin/demandes');
      
    });
  
});


  module.exports = router;