var express = require('express');
var router = express.Router();
var communModel = require('../Modele/Commun.js')
//const session = require('express-session'); 
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/connexion', function (req, res, next) {
    res.render('connexion');
});
/*
router.post('/connexion', function (req, res, next) {
  // Récupération des données du formulaire
  var mail = req.body.mail;
  var mdp = req.body.mdp;
  var session=req.session;
  // Appel à la fonction creat du modèle Utilisateur
  communModel.areUserValid(mail, mdp, function (result) {
    // Redirection vers la page d'accueil si l'ajout a réussi
    if (result) {
      // Si l'utilisateur n'est pas connecté, on redirige vers la page de connexion
      session.userid=mail;
      session.test="OUI";
      communModel.areRecruteur(req.session.userid, function(result){
        if (result){
          console.log("OUI RECRUT");
          communModel.readOrgaUser(req.session.userid, function (result){
            var orga = result.organisation;

             session.test=orga;
             console.log("ici" , orga);
             console.log("oijzoijùsfze", result);
          });
          
        }
      });
      
      //req.session.type = result;
      //console.log(req.session);
      res.redirect('/users/candidat');
    } else {
      // Sinon, on rend la vue "accueil"
      console.log("erreur");
      res.render('connexion');
    }
  });
});
*/
router.post('/connexion', function (req, res, next) {
  // Récupération des données du formulaire
  var mail = req.body.mail;
  var mdp = req.body.mdp;
  var session=req.session;
  // Appel à la fonction creat du modèle Utilisateur
  communModel.areUserValid(mail, mdp, function (result) {
    if (result) {
      session.userid = mail;
      session.type=result.type;
      console.log("type:", result)
      communModel.areRecruteur(session.userid, function(result) {
        if (result) {
          communModel.readOrgaUser(session.userid, function (result) {
            var orga = result.organisation;
            session.orga = orga;
            res.redirect('/users/candidat');
          });
        } else {
          res.redirect('/users/candidat');
        }
      });
    } else {
      console.log("erreur");
      res.render('connexion');
    }
  });
});



router.get('/inscription', function (req, res, next) {
  res.render('inscription');
});

router.post('/inscription', function (req, res, next) {
  // Récupération des données du formulaire
  var mail = req.body.mail;
  var nom = req.body.nom;
  var prenom = req.body.prenom;
  var mdp = req.body.mdp;
  var telephone = req.body.telephone;

  // Appel à la fonction creat du modèle Utilisateur
  communModel.creatUser(mail, nom, prenom, mdp, telephone, function (result) {
    if (result){ //result = vrai donc il y a une erreur
      res.redirect('/inscription');
    }
    else{
      res.redirect('/users/candidat');
    }
  });
});

router.get('/logout',(req,res) => {
  req.session.destroy();
  res.redirect('/');
  console.log(req.session.userid);
});
  


module.exports = router;
