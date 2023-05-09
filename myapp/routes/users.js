var express = require('express');
var router = express.Router();
var candidatModel = require('../Modele/Candidat.js')
var communModel = require('../Modele/Commun.js')
var Model = require('../Modele/user.js')
var orgaModel = require('../Modele/Organisation.js')


/*router.get('/userslist', function (req, res, next) {
  result = Model.readall(function (result) {
    res.render('usersList', {
      title: 'List des utilisateurs', users:
        result
    });
  });
});*/


router.get('/profil_candidat', function (req, res, next) {
  if (req.session.userid) {
    var mail = req.session.userid;
    result = communModel.readUser(mail, function (user) {
      result = candidatModel.readAllCandidature(mail, function (result) {
        res.render('profil_candidat', { user: user, candidatures: result });
      });
    });
  } else
    res.render('connexion');

});


router.get('/modifier_profil', function (req, res, next) {

  if (req.session.userid) {
    var mail = req.session.userid;
    result = communModel.readUser(mail, function (result) {
      res.render('modifier_profil', { nom: result.nom, prenom: result.prenom, mail: result.mail, mdp: result.mdp, telephone: result.telephone, statut: result.statut, date: result.dateCreation.toLocaleDateString("fr") });
    });
  } else
    res.render('connexion');
});

router.post('/modifier_profil', function (req, res, next) {
    var mail = req.session.userid;
    var nom = req.body.nom;
    var prenom = req.body.prenom;
    var telephone = req.body.telephone;
    
    candidatModel.updateUser(mail, nom, prenom, telephone, function (result) {
      //console.log(result);
      /*if (result) {
        //console.log("update oui");
        res.redirect('/users/profil_candidat');
      } else {
        res.render('connexion');
      }*/
      console.log("apres query");
      res.render('/users/profil_candidat');
    });
  
});
router.post('/modifier_profil/mdp', function (req, res, next) {
  var mail = req.session.userid;
    var mdp1 = req.body.mdp1;
    var mdp2 = req.body.mdp2;
    //if(mdp1 == mdp2){
      var ok = true;
    candidatModel.updateUserMdp(mdp1, mdp2, mail, function (result) {
      req.session.check = ok;
      if (result) {
        res.redirect('/users/profil_candidat', {check: ok});
      } else {
        res.render('connexion');
      }
    });
  /*}else{
    var ok = false;
    req.session.check = ok;
    res.redirect('/users/profil_candidat',{check : ok})
  }*/

});


router.post('/candidat', function (req, res, next) {

  if (req.session.userid) {

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

    }/*else{
          console.log("B");

          result = candidatModel.readAllOffreValide (function (results) {
          res.render('candidat', { title: 'List des Offres', listeOffre: results });
        });
    
    }*/}
  else {
    res.redirect('/connexion');
  }
});
/*router.get('/candidat', function (req, res, next) { 
 
  if(req.session.userid){

    if(req.body.form1){
  
        console.log("B");

        result = candidatModel.readAllOffreValide (function (results) {
        res.render('candidat', { title: 'List des Offres', listeOffre: results });
      });
  
    }
    else{
    res.redirect('/connexion');
    }
});*/

router.get('/candidat', function (req, res, next) {

  if (req.session.userid) {

    result = candidatModel.readAllOffreValide(function (results) {
      res.render('candidat', { title: 'List des Offres', listeOffre: results });
    });
  } else
    res.redirect('/connexion');

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
  if (req.session.userid) {

    result = candidatModel.readUserDmdOrga(mail, function (results) {
      resultOrga = orgaModel.readOrga(function (orgaResult) {
        orgaResult ??= [];
        results ??= [];
        console.log("demandeOrga:" + results)
        res.render('formulaire_orga', { organisation: orgaResult, demandeOrga: results });
      });
    });
  } else
    res.redirect('/connexion');

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



module.exports = router;