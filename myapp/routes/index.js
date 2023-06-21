const express = require('express');
const router = express.Router();
const communModel = require('../Modele/Commun.js');
const recruteurModel = require('../Modele/Recruteur.js');
const crypt = require('../Modele/pass.js')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/connexion', function (req, res, next) {
    res.render('connexion');
});

router.post('/connexion', function (req, res, next) {
  let mail = req.body.mail;
  let mdp = req.body.mdp;
  let session=req.session;

  communModel.areUserValid(mail, mdp, function (result) {
    if (result && result.statut==1) {
      session.userid = mail;
      session.nom = result.nom;
      session.prenom= result.prenom;
      session.type=result.type;
          recruteurModel.readAllOrgaRecruteur(session.userid, function (result) {
            if(result.length > 0 && result){
              session.orga = result;
            }else{
              session.orga=[];
            }
            res.status(200).redirect('/users/candidat');
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
    res.status(401).render('index');
  }
});

router.post('/inscription', function (req, res, next) {
  let mail = req.body.mail;
  let nom = req.body.nom;
  let prenom = req.body.prenom;
  let mdp = req.body.mdp;
  let telephone = req.body.telephone;
  telephone = telephone.replace(/\s/g, "");

  const cnilPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[a-zA-Z\d!@#$%^&*()]{12,}$/;
  if (cnilPasswordRegex.test(mdp)) {
    crypt.generateHash(mdp, function(crypto){
      if (crypto){
        const telRegex = /^\d{10}$/;
        if(telRegex.test(telephone)){
          communModel.creatUser(mail, nom, prenom,crypto, telephone, function (result) {
            if (result){ 
              res.render('connexion', {message2 : "Inscription réussie, veuillez vous connecter."});
            }
            else{
              res.status(500).redirect('/inscription');
            }
          });
        }else{
          res.status(415).render('inscription',  {messagetel : "Numéro de téléphone incorect."})
        }
        
      }else{
        res.status(415).redirect('/inscription');
      }
    });
    
  }else{
    res.status(415).render('inscription',  {message : "Mot de passe incorect, veuillez en choisir un d'au minimum 12 caractères comprenant des majuscules, des minuscules, des chiffres et des caractères spéciaux."})
  }
});

router.get('/logout',(req,res) => {
  req.session.destroy();
  res.redirect('/');
});
  


module.exports = router;
