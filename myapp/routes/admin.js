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

router.get('/admin/demandes', function (req, res, next) {
  var mail=req.session.userid;
  adminModel.readAllDmdAdmin(function (result) {  
    res.render('admin_demandes', {demandeAdmin: result, req : req});
  });   
});


  module.exports = router;