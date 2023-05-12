var express = require('express');
var router = express.Router();
var candidatModel = require('../Modele/Candidat.js')
var communModel = require('../Modele/Commun.js')
var Model = require('../Modele/user.js')
var orgaModel = require('../Modele/Organisation.js')


router.get('/profil_candidat', function (req, res, next) {
  
    var mail = req.session.userid;
    console.log(req.session.userid);
    communModel.readUser(mail, function (user) {
      candidatModel.readAllCandidature(mail, function (result) {
        res.render('profil_candidat', { user: user, candidatures: result });
      });
    });
});


router.get('/modifier_profil', function (req, res, next) {

  
    var mail = req.session.userid;
    communModel.readUser(mail, function (result) {
      res.render('modifier_profil', { nom: result.nom, prenom: result.prenom, mail: result.mail, mdp: result.mdp, telephone: result.telephone, statut: result.statut, date: result.dateCreation.toLocaleDateString("fr") });
    });
  
});

router.post('/modifier_profil', function (req, res, next) {
    var mail = req.session.userid;
    var nom = req.body.nom;
    var prenom = req.body.prenom;
    var telephone = req.body.telephone;
    
    candidatModel.updateUser(mail, nom, prenom, telephone, function (result) {
      res.render('/users/profil_candidat');
    });
  
});
router.post('/modifier_profil/mdp', function (req, res, next) {
  var mail = req.session.userid;
    var mdp1 = req.body.mdp1;
    var mdp2 = req.body.mdp2;
    var ok = true;
    candidatModel.updateUserMdp(mdp1, mdp2, mail, function (result) {
      
      if (result) {
        res.redirect('/users/profil_candidat', {check: ok});
      } else {
        res.render('connexion');
      }
    });
  

});


router.post('/candidat', function (req, res, next) {

  

    if (req.body.form1) {
      console.log("A");

      var organisation = req.body.organisation;
      var lieu = req.body.lieu;
      var statut = req.body.statut;
      var salaire = req.body.salaire;
      var type = req.body.type;
      var intitule = req.body.intitule;
      console.log ("body user.js" , organisation, lieu, statut, salaire, type, intitule);

      candidatModel.readOffreFiltre(organisation, lieu, statut, salaire, type, intitule, function (results) {
        res.render('candidat', { title: 'List des Offres', listeOffre: results });
      });

    }
    /*else{
          console.log("B");

          result = candidatModel.readAllOffreValide (function (results) {
          res.render('candidat', { title: 'List des Offres', listeOffre: results });
        });
    
    }*/
  
});


router.get('/candidat', function (req, res, next) {
    candidatModel.readAllOffreValide(function (results) {
      res.render('candidat', { title: 'List des Offres', listeOffre: results });
    });
  
});

/*router.get('/candidat', function (organisation, lieu, statut, salaire, type, intitule,req, res, next) { 
  if(req.session.userid){
    var mail=req.session.userid;
    result = candidatModel.readAllOffreFiltre (function (organisation, lieu, statut, salaire, type, intitule, result) {
      res.render('candidat', { title: 'List des Offres Filtres', users: result });
    });
    }else
    res.render('connexion');
  
});*/
/*
if(req.session.userid){
    var mail=req.session.userid;
    
    }else
    res.render('connexion');
*/

router.get('/creer_orga', function (req, res, next) {
  var mail=req.session.userid;

    candidatModel.readUserDmdOrga(mail, function (results) {
      resultOrga = orgaModel.readOrga(function (orgaResult) {
        orgaResult ??= [];
        results ??= [];
        console.log("demandeOrga:" + results)
        res.render('formulaire_orga', { organisation: orgaResult, demandeOrga: results });
      });
    });
});

router.post('/creer_orga', function (req, res, next) {
  var mail=req.session.userid;

  var siren = req.body.siren;
  var nom = req.body.nom;
  var type = req.body.type;
  var siege = req.body.siege;

  candidatModel.creatDmdOrga(nom, siren, type, siege, mail, function (result) {
    if (result) {
      res.redirect('/users/creer_orga');
    } else {
      res.redirect('/users/creer_orga');
    }
  });
});





router.get('/demandes', function (req, res, next) {
  var mail=req.session.userid;

    candidatModel.readUserDmdRecruteur(mail, function (result) {
    orgaModel.readOrga(function (orgaResult) {
      
      candidatModel.readUserDmdAdmin(mail, function (adminResult) {
        
        if (adminResult.length > 0 && (adminResult[0].statut === "En attente" || adminResult[0].statut === "Validé")) {
          autorisation = false;
        } else {
          autorisation = true;
        }
        
        result ??= [];
        orgaResult ??= [];
        adminResult ??= [];
        res.render('formulaire_recruteur', {autorisation, demandeRecrut: result, organisation: orgaResult, demandeAdmin: adminResult });
        });
      });
    });    
});


router.post('/demandes/recruteur', function (req, res, next) {
  var mail=req.session.userid;

    var siren = req.body.choix; //renvoie le siren
    recruteurModel.readAllDmdRecruteur(siren, function (resultDmd) {
      if(resultDmd )
    candidatModel.creatDmdRecruteur(mail, siren, function (result) {
      console.log(result);
      if (result) {
        res.redirect('/users/demandes');
      } else {
        res.redirect('/users/demandes');
      }
    });
  });

});

router.post('/demandes/admin', function (req, res, next) {
  var mail=req.session.userid;
  
    candidatModel.creatDmdAdmin(mail, function (result) {
      if (result) {
        res.redirect('/users/demandes');
      } else {
        res.redirect('/users/demandes');
      }
    });
 
});

router.get('/demandes/recruteurSupp/:siren', function (req, res, next) {
  var mail= req.session.userid;
  let siren = req.params.siren;
    candidatModel.deleteDmdRecruteurOrga(mail, siren, function (result) {
      if (result) {
        res.redirect('/users/demandes');
      } else {
        res.redirect('/users/demandes');
      }
    });
 
});

router.post('/demandes/adminSupp', function (req, res, next) {
  var mail=req.session.userid;
  var dateSupp = req.body['supp'];
  
  console.log("Date à supprimer : " + dateSupp);
    candidatModel.deleteDmdAdmin(mail, dateSupp, function (result) {
      if (result) {
        res.redirect('/users/demandes');
      } else {
        res.redirect('/users/demandes');
      }
    });
 
});

module.exports = router;