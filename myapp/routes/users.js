const express = require('express');
const router = express.Router();
const candidatModel = require('../Modele/Candidat.js')
const communModel = require('../Modele/Commun.js')
const recruteurModel= require('../Modele/Recruteur.js')
const middleware = require('../middleware')
const crypt = require('../Modele/pass.js')
const escape = require('escape-html');


router.use(middleware.isLoggedMiddleware);

router.get('/profil_candidat', function (req, res, next) {
    req.session.uploaded_files =undefined;
    let mail = req.session.userid;
    communModel.readUser(mail, function (user) {
      if (user){
        candidatModel.readAllCandidature(mail, function (result) {
        if (result){
          res.render('profil_candidat', { user: user, candidatures: result , req : req});
        }else{
          res.status((500)).send('Une erreur s\'est produite lors de la lecture de l\'utilisateur.');
        }  
      });
    }else{
      res.status(500).send('Une erreur s\'est produite lors de la lecture de tous les utilisateurs.');
    }
  });
});


router.get('/modifier_profil', function (req, res, next) {
  let mail = req.session.userid;
  communModel.readUser(mail, function (result) {
    if (result){
      let message = req.session.message;
      delete req.session.message;
      res.render('modifier_profil', { nom: result.nom, prenom: result.prenom, mail: result.mail, mdp: result.mdp, telephone: result.telephone, statut: result.statut, date: result.dateCreation.toLocaleDateString("fr") , req : req, message : message});
    }else{
      res.status(500).send('Une erreur s\'est produite lors de la lecture de tout les utilisateurs.');
    }   
  });
});

router.post('/modifier_profil', function (req, res, next) {
    let mail = req.session.userid;
    let nom = req.body.nom;
    let prenom = req.body.prenom;
    let telephone = req.body.telephone;
      candidatModel.updateUser(mail, nom, prenom, telephone, function (result) {
        if (result){
          res.redirect('/users/profil_candidat');
        }else{
          res.redirect(500, '/users/modifier_profil');
        }    
      });

});

router.post('/modifier_profil/mdp', function (req, res, next) {
  let mail = req.session.userid;
  let mdp1 = req.body.mdp1;
  let mdp2 = req.body.mdp2;
  
  if (mdp1 === mdp2) {
    const cnilPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[a-zA-Z\d!@#$%^&*()]{12,}$/;
    if (cnilPasswordRegex.test(mdp1)) {

      crypt.generateHash(mdp1, function(crypto){
      if (crypto){
        console.log (mdp1);

        candidatModel.updateUserMdp(crypto, mail, function (result) {
          if (result) {
            req.session.message = true;
            res.redirect('/users/modifier_profil');
          } else {
            res.redirect('/users/modifier_profil');
          }
        });
      }else{
        res.redirect(500, '/users/modifier_profil');

      }
      });
    
    }else{
      res.redirect('/users/modifier_profil');
    }
  } else {
    req.session.message = false;
    res.redirect('/users/modifier_profil');
  }
});


router.post('/candidat', function (req, res, next) {

  if (req.body.form1) {
    let organisation = escape(req.body.organisation);
    let lieu = escape(req.body.lieu);
    let statut = escape(req.body.statut);
    let salaire = escape(req.body.salaire);
    let type = escape(req.body.type);
    let intitule = escape(req.body.intitule);
    candidatModel.readOffreFiltre(organisation, lieu, statut, salaire, type, intitule, function (results) {
      if (results){
        res.render('candidat', { title: 'List des Offres', listeOffre: results, req : req });
      }else{
        res.redirect('users/candidat');
      }
    });
  }
});


router.get('/candidat', function (req, res, next) {
  req.session.current_profil=1;
  req.session.uploaded_files =undefined;
  candidatModel.readAllOffreValide(function (results) {
    if(results){
      res.render('candidat', { title: 'List des Offres', listeOffre: results, req : req});
    }else{
      res.status(500).send('Une erreur s\'est produite lors de la lecture des données.');
    }
  });
});

router.get('/creer_orga', function (req, res, next) {
  let mail=req.session.userid;
  candidatModel.readUserDmdOrga(mail, function (results) {
    if(results){
      communModel.readOrga(function (orgaResult) {
        if (orgaResult){
          orgaResult ??= [];
          results ??= [];
          res.render('formulaire_orga', { organisation: orgaResult, demandeOrga: results, req : req });
        }else{
          res.status(500).send('Une erreur s\'est produite lors de la lecture des données.');
        }
    });
    }else{
      res.status(500).send('Une erreur s\'est produite lors de la lecture des données.');
    } 
  });
});

router.post('/creer_orga', function (req, res, next) {
  let mail=escape(req.session.userid);
  let siren = escape(req.body.siren);
  let siren2 = siren.replace(/\s/g, "");
  let nom = escape(req.body.nom);
  let type = escape (req.body.type);
  let siege = escape (req.body.siege);
  console.log(siren2);
  console.log(req.body.siren);
  if ((typeof nom === "string") &&(typeof type === "string") &&(typeof siege === "string")){
     candidatModel.creatDmdOrga(nom, siren2, type, siege, mail, function (result) {
    if (result) {
      res.redirect('/users/creer_orga');
    } else {
      candidatModel.readUserDmdOrga(mail, function (results) {
        if(results){
          communModel.readOrga(function (orgaResult) {
            if (orgaResult){
              orgaResult ??= [];
              results ??= [];
              res.render('formulaire_orga', { organisation: orgaResult, demandeOrga: results, req : req, message : "Les données ne sont pas valables." });
            }else{
              res.status(500).send('Une erreur s\'est produite lors de la lecture des données.');
            }
        });
        }else{
          res.status(500).send('Une erreur s\'est produite lors de la lecture des données.');
        } 
      });
    }
  });
  }else{
    candidatModel.readUserDmdOrga(mail, function (results) {
      if(results){
        communModel.readOrga(function (orgaResult) {
          if (orgaResult){
            orgaResult ??= [];
            results ??= [];
            res.render('formulaire_orga', { organisation: orgaResult, demandeOrga: results, req : req, message : "Les données ne sont pas valables." });
          }else{
            res.status(500).send('Une erreur s\'est produite lors de la lecture des données.');
          }
      });
      }else{
        res.status(500).send('Une erreur s\'est produite lors de la lecture des données.');
      } 
    });
  }
 
});

router.get('/demandes', function (req, res, next) {
  let mail=req.session.userid;
  candidatModel.readUserDmdRecruteur(mail, function (result) {
    if (result){
      communModel.readAllOrga(function (orgaResult) {
        if (orgaResult){
          candidatModel.readUserDmdAdmin(mail, function (adminResult) {
            if (adminResult){
              result ??= [];
              orgaResult ??= [];
              adminResult ??= [];
              res.render('demandes_user', {demandeRecrut: result, organisation: orgaResult, demandeAdmin: adminResult , req : req});
            }else{
              res.status(500).send('Une erreur s\'est produite lors de la mise a jour des données.');
            }
            
          });
        }else{
          res.status(500).send('Une erreur s\'est produite lors de la mise a jour des données.');
        }
        
      });
    }else{
      res.status(500).send('Une erreur s\'est produite lors de la mise a jour des données.');
    }
    
  });    
});


router.post('/demandes/recruteur', function (req, res, next) {
  let mail=req.session.userid;
  let siren = [{siren : req.body.choix}]; //renvoie le siren
  //recruteurModel.readAllDmdRecruteur(siren[siren.length-1].siren, function (resultDmd) {
      candidatModel.creatDmdRecruteur(mail, siren[siren.length-1].siren, function (result) {
      if (result) {
        res.redirect('/users/demandes');
      } else {
        res.redirect(500, '/users/demandes');
      }
  });
});

router.post('/demandes/admin', function (req, res, next) {
  let mail=req.session.userid;
  candidatModel.creatDmdAdmin(mail, function (result) {
    if (result) {
      res.redirect('/users/demandes');
    } else {
      res.redirect(500, '/users/demandes');
    }
  });
});

router.get('/demandes/recruteurSupp/:siren', function (req, res, next) {
  let mail= req.session.userid;
  let siren = req.params.siren;
  candidatModel.deleteDmdRecruteurOrga(mail, siren, function (result) {
    if (result) {
      res.redirect('/users/demandes');
    } else {
      res.redirect(500, '/users/demandes');
    }
  });
 
});

router.get('/demandes/adminSupp', function (req, res, next) {
  let mail=req.session.userid;

  candidatModel.deleteDmdAdmin(mail, function (result) {
    if (result) {
      res.redirect('/users/demandes');
    } else {
      res.redirect(500, '/users/demandes');
    }
  });
 
});

module.exports = router;