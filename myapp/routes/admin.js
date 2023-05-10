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

  
    if (req.session.userid||communModel.areAdmin(req.session.userid)) {

      var mail = req.query.mail;
      var nom = req.query.nom;
      var prenom = req.query.prenom;
      var date = req.query.date;
      var statut = req.query.statut;
      var type = req.query.type;

      adminModel.readUserFiltre(mail, nom, prenom, date, type, statut, function (results) {
        res.render('admin', {userResult: results, search:{
          mail:mail, nom:nom, prenom:prenom, date:date, type:type, statut:statut
        } });
      });
    }
    else if (!communModel.areRecruteur(req.session.userid)){
      res.redirect('/users/candidat');
    }else{
    res.redirect('/connexion');
    }
});

router.post('/administrateur/activer', function (req, res, next) {
  var mail = req.session.userid;
  if (mail||communModel.areAdmin(mail)) {
    var mail2 =req.body.mail; 
    
      adminModel.enableUser(mail2, function (results) {
        res.redirect('/admin/administrateur')
      });
    
  }
  else if (!communModel.areRecruteur(mail)){
    res.redirect('/users/candidat');
  }else{
  res.redirect('/connexion');
  }
});

router.get('/administrateur/desactiver', function (req, res, next) {
  var mail = req.session.userid;

  if (mail||req.session.type>=3) {
    var mail2 =req.query.mail;
    console.log("req.query: " + req.query);  
      adminModel.disableUser(mail2, function (results) {
        res.redirect('/admin/administrateur')
      });
    
  }
  else if (!communModel.areRecruteur(mail)){
    res.redirect('/users/candidat');
  }else{
  res.redirect('/connexion');
  }
});



  module.exports = router;