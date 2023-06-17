var express = require('express');
var router = express.Router();
var communModel = require('../Modele/Commun.js');
var recruteurModel = require('../Modele/Recruteur.js');
var crypt = require('../Modele/pass.js')

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
  var mail = req.body.mail;
  var mdp = req.body.mdp;
  var session=req.session;

  communModel.areUserValid(mail, mdp, function (result) {
    if (result && result.statut==1) {
      session.userid = mail;
      session.nom = result.nom;
      session.prenom= result.prenom;
      session.type=result.type;
          recruteurModel.readAllOrgaRecruteur(session.userid, function (result) {
            if(result){
              session.orga = result;
            }else{
              session.orga=[];
            }
            res.redirect('/users/candidat');
          });
    }else if(result.statut==0){
      res.status(404).render('connexion', {message : "Compte désactivé."});
    } else {
      res.status(404).render('connexion', {message : "Identifiant ou mot de passe incorrect"});
    }
  });
});

router.get('/inscription', function (req, res, next) {
  //si la session n'existe pas, on peut s'inscrire
  if(req.session.userid==undefined){
    res.render('inscription');
  }else{
    //sinon, pas le droit de s'inscrire
    res.render('index');
  }
});

router.post('/inscription', function (req, res, next) {
  var mail = req.body.mail;
  var nom = req.body.nom;
  var prenom = req.body.prenom;
  var mdp = req.body.mdp;
  var telephone = req.body.telephone;

  const cnilPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[a-zA-Z\d!@#$%^&*()]{12,}$/;
  if (cnilPasswordRegex.test(mdp)) {
    console.log (mdp);

    crypt.generateHash(mdp, function(crypto){
      if (crypto){
        console.log (crypto);
        const telRegex = /^\d{10}$/;
        if(telRegex.test(telephone)){
          communModel.creatUser(mail, nom, prenom,crypto, telephone, function (result) {
            console.log("result", result);
            if (result){ 
              res.render('connexion', {message2 : "Inscription réussie, veuillez vous connecter."});
            }
            else{
              res.redirect('/inscription');
            }
          });
        }else{
          res.render('inscription',  {messagetel : "Numéro de téléphone incorect."})
        }
        
      }else{
        res.redirect('/inscription');
      }
    });
    
  }else{
    res.render('inscription',  {message : "Mot de passe incorect, veuillez en choisir un d'au minimum 12 caractères comprenant des majuscules, des minuscules, des chiffres et des caractères spéciaux."})
  }
});

router.get('/logout',(req,res) => {
  req.session.destroy();
  res.redirect('/');
});
  


module.exports = router;
