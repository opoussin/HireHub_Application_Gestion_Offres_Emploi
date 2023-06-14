var express = require('express');
var router = express.Router();
var candidatModel = require('../Modele/Candidat.js')
var communModel = require('../Modele/Commun.js')
var recruteurModel= require('../Modele/Recruteur.js')
var middleware = require('../middleware')

router.use(middleware.isLoggedMiddleware);

router.get('/profil_candidat', function (req, res, next) {
    req.session.uploaded_files =undefined;
    var mail = req.session.userid;
    communModel.readUser(mail, function (user) {
      if (user){
        candidatModel.readAllCandidature(mail, function (result) {
        if (result){
          res.render('profil_candidat', { user: user, candidatures: result , req : req});
        }else{
          res.status(500).send('Une erreur s\'est produite lors de la lecture de l\'utilisateur.');
        }  
      });
    }else{
      res.status(500).send('Une erreur s\'est produite lors de la lecture de tout les utilisateurs.');
    }
  });
});


router.get('/modifier_profil', function (req, res, next) {
  let mail = req.session.userid;
  communModel.readUser(mail, function (result) {
    if (result){
      var message = req.session.message;
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
        res.status(500).send('Une erreur s\'est produite lors de la mise a jour des données utilisateur');
      }    
    });
});

router.post('/modifier_profil/mdp', function (req, res, next) {
  let mail = req.session.userid;
  let mdp1 = req.body.mdp1;
  let mdp2 = req.body.mdp2;
  
  if (mdp1 === mdp2) {
    candidatModel.updateUserMdp(mdp1, mail, function (result) {
      if (result) {
        req.session.message = true;
        res.redirect('/users/modifier_profil');
      } else {
        res.status(500).send('Une erreur s\'est produite lors de la mise a jour des données.');
      }
    });
  } else {
    req.session.message = false;
    res.status(500).send('Une erreur s\'est produite lors de la mise a jour des données.');
  }
});


router.post('/candidat', function (req, res, next) {

  if (req.body.form1) {
    let organisation = req.body.organisation;
    let lieu = req.body.lieu;
    let statut = req.body.statut;
    let salaire = req.body.salaire;
    let type = req.body.type;
    let intitule = req.body.intitule;
    candidatModel.readOffreFiltre(organisation, lieu, statut, salaire, type, intitule, function (results) {
      if (result){
        res.render('candidat', { title: 'List des Offres', listeOffre: results, req : req });
      }else{
        res.status(500).send('Une erreur s\'est produite lors de lecture des offres filtrées.');
      }
    });
  }
});


router.get('/candidat', function (req, res, next) {
  req.session.current_profil=1;
  req.session.uploaded_files =undefined;
  candidatModel.readAllOffreValide(function (results) {
    if(result){
      res.render('candidat', { title: 'List des Offres', listeOffre: results, req : req});
    }else{
      res.status(500).send('Une erreur s\'est produite lors de la mise a jour des données.');
    }
  });
});

router.get('/creer_orga', function (req, res, next) {
  let mail=req.session.userid;
  candidatModel.readUserDmdOrga(mail, function (results) {
    if(results){
      resultOrga = orgaModel.readOrga(function (orgaResult) {
        if (orgaResults){
          orgaResult ??= [];
          results ??= [];
          console.log("demandeOrga:" + results)
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
  let mail=req.session.userid;
  let siren = req.body.siren;
  let nom = req.body.nom;
  let type = req.body.type;
  let siege = req.body.siege;

  candidatModel.creatDmdOrga(nom, siren, type, siege, mail, function (result) {
    if (result) {
      res.redirect('/users/creer_orga');
    } else {
      res.status(500).send('Une erreur s\'est produite lors de l\insertion des données.');
    }
  });
});

router.get('/demandes', function (req, res, next) {
  let mail=req.session.userid;
  candidatModel.readUserDmdRecruteur(mail, function (result) {
    if (result){
      orgaModel.readOrga(function (orgaResult) {
        if (orgaResult){
          candidatModel.readUserDmdAdmin(mail, function (adminResult) {
            if (adminResult){
              if (adminResult.length > 0 && (adminResult[0].statut === "En attente" || adminResult[0].statut === "Validé")) {
                autorisation = false;
              } else {
                autorisation = true;
              }
              
              result ??= [];
              orgaResult ??= [];
              adminResult ??= [];
              res.render('formulaire_recruteur', {autorisation, demandeRecrut: result, organisation: orgaResult, demandeAdmin: adminResult , req : req});
            }else{
              res.status(500).send('Une erreur s\'est produite lors de la mise a jour des données adminResult.');
            }
            
          });
        }else{
          res.status(500).send('Une erreur s\'est produite lors de la mise a jour des données orgaResult.');
        }
        
      });
    }else{
      res.status(500).send('Une erreur s\'est produite lors de la mise a jour des données de demande.');
    }
    
  });    
});


router.post('/demandes/recruteur', function (req, res, next) {
  let mail=req.session.userid;
  let siren = [{siren : req.body.choix}]; //renvoie le siren
  recruteurModel.readAllDmdRecruteur(siren[siren.length-1].siren, function (resultDmd) {
    if(resultDmd){
      candidatModel.creatDmdRecruteur(mail, siren[siren.length-1].siren, function (result) {
      if (result) {
        res.redirect('/users/demandes');
      } else {
        res.status(500).send('Une erreur s\'est produite lors de la création des données.');
      }
    });
    }else{
      res.status(500).send('Une erreur s\'est produite lors de la lecture données dmd recruteurs.');
    }
  });
});

router.post('/demandes/admin', function (req, res, next) {
  let mail=req.session.userid;
  candidatModel.creatDmdAdmin(mail, function (result) {
    if (result) {
      res.redirect('/users/demandes');
    } else {
      res.status(500).send('Une erreur s\'est produite lors de la lecture des données.');
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
        res.status(500).send('Une erreur s\'est produite lors de la lecture des données.');
    }
  });
 
});

router.get('/demandes/adminSupp', function (req, res, next) {
  let mail=req.session.userid;

  candidatModel.deleteDmdAdmin(mail, function (result) {
    if (result) {
      res.redirect('/users/demandes');
    } else {
      res.status(500).send('Une erreur s\'est produite lors de la mise a jour des données.');
    }
  });
 
});

module.exports = router;