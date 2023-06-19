var express = require('express');
var router = express.Router();
var adminModel = require('../Modele/Administrateur.js')
var communModel = require('../Modele/Commun.js')
var recrutModel = require('../Modele/Recruteur.js')
const { search } = require('./users.js');
var middleware = require('../middleware')

router.use(middleware.isLoggedMiddleware);
router.use(middleware.isAdminMiddleware);


router.get('/administrateur', function (req, res, next) {
      var mail = req.query.mail;
      var nom = req.query.nom;
      var prenom = req.query.prenom;
      var date = req.query.date;
      var statut = req.query.statut;
      var type = req.query.type;

      adminModel.readUserFiltre(mail, nom, prenom, date, type, statut, function (results) {
        if(results){
          res.render('admin', {userResult: results, req: req, search:{mail:mail, nom:nom, prenom:prenom, date:date, type:type, statut:statut} });
        }else{
          res.status(404).redirect('/admin/demandes');
        }
        
      });
    
});

router.get('/administrateur/activer', function (req, res, next) {
  var mail = req.session.userid;
  
    var mail2 =req.query.user; 
    if(mail!=mail2){    
      adminModel.enableUser(mail2, function (results) {
        if(results){
          res.statut(204).redirect('/admin/administrateur')
        }else{
          res.status(404).redirect('/admin/administrateur')
        };
      });
    }else{
      res.status(401).redirect('/admin/administrateur'); //ne peut pas se réactiver lui même
    }
});

router.get('/administrateur/desactiver', function (req, res, next) {
    var mail2 =req.query.user;     
      adminModel.disableUser(mail2, function (results) {
        if(results){
          res.status(204).redirect('/admin/administrateur')
        }else{
          res.status(404).redirect('/admin/administrateur')
        };
      });
});

router.get('/administrateur/supprimer', function (req, res, next) {
  var mail = req.session.userid;
    var mail2 =req.query.user;
      communModel.deleteUser(mail2, function (results) {
        if(results){
          res.status(204).redirect('/admin/administrateur')
        }else{
          res.status(404).redirect('/admin/administrateur')
        }
      });
});

router.get('/demandes', function (req, res, next) {
  var mail = req.query.mail;
  var date = req.query.date;
  adminModel.readDmdAdmin("En attente", mail, date, function (adminResult) {  
    if(adminResult){
      adminModel.readDmdOrga("En attente",mail, date,function(orgaResult){
        if(orgaResult){
          adminModel.readAllDmdAdmin(mail, date,function (adminAllResult) { 
            if(adminAllResult){ 
              adminModel.readAllDmdOrga(mail, date,function(orgaAllResult){
                orgaResult ??= [];
                res.status(200).render('admin_demandes', {demandeOrga: orgaResult, demandeAdmin: adminResult, demandeAllOrga: orgaAllResult, demandeAllAdmin: adminAllResult, req : req, search:{mail:mail, date:date}});
              });
            }else{
              res.status(404).redirect('/admin/administrateur');
            }
          });
        }else{
          res.status(404).redirect('/admin/administrateur');

        }
      });
    }else{
      res.status(404).redirect('/admin/administrateur');

    }
  });
});

router.get('/demandes_admin/accept', function (req, res, next) {
  let user = req.query.user;
  let value=true;
  adminModel.acceptAdmin(user, function (result) {
    if(result){
      adminModel.updateDmdAdmin(user, value, function (result) {
        if(result){
        // console pour simuler l'envoi d'un mail de notification 
        console.log ( " La demande de l'utilisateur ", user, "pour devenir administrateur a été acceptée");
          res.status(204).redirect('/admin/demandes');
        }else{

          res.status(404).redirect('/admin/demandes?error=1');
        }
      });
    }else{
      res.status(404).redirect('/admin/demandes');
    }
  });
});

router.get('/demandes_admin/deny', function (req, res, next) {
  var mail= req.session.userid;
  let user = req.query.user;
  let value=false;
  
    adminModel.updateDmdAdmin(user, value, function (result) {
      if(result){
        // console pour simuler l'envoi d'un mail de notification 
        console.log ( " La demande de l'utilisateur ", user, "pour devenir administrateur a été refusée");
        res.statut(204).redirect('/admin/demandes');
      }else{
        res.status(404).redirect('/admin/demandes');
      }
    });
});


router.get('/demandes_orga/accept', function (req, res, next) {
  var mail= req.session.userid;
  let siren = req.query.siren;
  let nom = req.query.nom;
  let type = req.query.type;
  let siege = req.query.siege;
  let user = req.query.user;

  let value=1;
  adminModel.acceptOrga(nom, siren, type, siege, mail,value, function (result) {
    if(result){
      // console pour simuler l'envoi d'un mail de notification 
      console.log ( " La demande de l'utilisateur ", user, "pour créer l'organisation de siren", siren , "a été acceptée");
      res.status(204).redirect('/admin/demandes');
    }else{      
      res.status(404).redirect('/admin/demandes');
    }
  });
});

router.get('/demandes_orga/deny', function (req, res, next) {
  let mail= req.session.userid;
  let siren = req.query.siren;
  let user = req.query.user;

  let value=0;
    adminModel.updateDmdOrga(siren, user, value, function (result) {
      if(result){
      // console pour simuler l'envoi d'un mail de notification 
      console.log ( " La demande de l'utilisateur ", user, "pour créer l'organisation de siren", siren , "a été refusée");
        res.status(204).redirect('/admin/demandes');

      }else{
        res.status(404).redirect('/admin/demandes');
      }
    });
});

router.get('/profil_admin', function (req, res, next) {
  let mail= req.session.userid;
  
    communModel.readUser(mail, function (result) {
      if(result){
        res.status(200).render('profil_administrateur', {user: result,  req : req});
      }else{
        res.status(404).redirect('/users/profil_candidat')
      }
    });
  
});

router.get('/profil_admin', function (req, res, next) {
  var mail = req.session.userid;
  communModel.readUser(mail, function (user) {
    if(user){
      res.render('profil_administrateur', { user: user[0], req : req});
    }else{
      res.status(404).redirect('/connexion');
    }
  });
});


  module.exports = router;