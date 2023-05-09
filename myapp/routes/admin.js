var express = require('express');
var router = express.Router();
var adminModel = require('../Modele/Administrateur.js')
var communModel = require('../Modele/Commun.js')
var recrutModel = require('../Modele/Recruteur.js')
var userModel = require('../Modele/Utilisateur.js')


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
  var mail=req.session.userid;
  if(mail||communModel.areAdmin(mail)){
    adminModel.readAllUser(function (result) {
      console.log(result);
      res.render('admin', {userResult:result});
      
    });  
  }
  else if (!communModel.areRecruteur(mail)){
    res.redirect('/users/candidat');
  }else{
  res.redirect('/connexion');
  }
});

router.post('/administrateur', function (req, res, next) {

  if (req.session.userid) {

      var mail = req.body.mail;
      var nom = req.body.nom;
      var prenom = req.body.prenom;
      var date = req.body.date;
      var statut = req.body.statut;
      var type = req.body.type;

      adminModel.readUserFiltre(mail, nom, prenom, date, type, statut, function (results) {
        res.render('admin', {userResult: results });
      });

  }  
  else {
    res.redirect('/connexion');
  }
});

  module.exports = router;