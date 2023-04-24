var express = require('express');
var router = express.Router();
var candidatModel = require('../Modele/Candidat.js')
var communModel = require('../Modele/Commun.js')
var Model = require('../Modele/user.js')

router.get('/userslist', function (req, res, next) {
  result = Model.readall(function (result) {
    res.render('usersList', {
      title: 'List des utilisateurs', users:
        result
    });
  });
});

router.get('/candidat', function (req, res, next) {
  res.render('candidat');
});

router.get('/profil_candidat', function (req, res, next) {
  var email = "oceane@etu";
  result = communModel.readUser(email, function (user) {
    result = candidatModel.readAllCandidature(email, function (result) {
      res.render('profil_candidat', { user: user, candidatures: result });
    });
  });

});


router.get('/modifier_profil', function (req, res, next) {
  var email = "oceane@etu";
  result = communModel.readUser(email, function (result) {
    console.dir(result);
    res.render('modifier_profil', { nom: result.nom, prenom: result.prenom, mail: result.mail, mdp: result.mdp, telephone: result.telephone, statut: result.statut, date: result.dateCreation.toLocaleDateString("fr") });
  });

});

router.post('/modifier_profil', function (req, res, next) {

  if (req.body.form1) {
    var mail = "oceane@etu";
    var nom = req.body.nom;
    var prenom = req.body.prenom;
    var telephone = req.body.telephone;
    //var mail = req.body.mail;
    candidatModel.updateUser(mail, nom, prenom, telephone, function (result) {
      console.log(result);
      if (result) {
        res.redirect('/users/profil_candidat');
      } else {
        res.render('connexion');
      }
    });
  }
  if (req.body.form2) {
    var mdp1 = req.body.mdp1;
    var mdp2 = req.body.mdp2;
    candidatModel.updateUserMdp(mdp1, mdp2, mail, function (result) {
      if (result) {
        res.redirect('/users/profil_candidat');
      } else {
        res.render('connexion');
      }
    });
  }

})

router.get('/administrateur', function (req, res, next) {
  res.render('admin');
});

router.get('/devenirAdministrateur', function (req, res, next) {
  res.render('formulaire_admin');
});

router.post('/devenirAdministrateur', function (req, res, next) {
  var mail = req.body.mail;

  candidatModel.creatDmdAdmin(mail, function (result) {
    res.redirect('/admin');
  });
});

router.get('/recruteur', function (req, res, next) {
  res.render('recruteur');
});

router.get('/devenirRecruteur', function (req, res, next) {
  res.render('formulaire_recruteur');
});

router.post('/devenirRecruteur', function (req, res, next) {
  var mail = req.body.mail;
  var siren = req.body.siren;

  candidatModel.creatDmdRecruteur(siren, mail, function (result) {
    res.redirect('/admin');
  });
});
router.get('/candidat', function (req, res, next) { 
  result = candidatModel.readAllOffreValide (function (results) {
    res.render('candidat', { title: 'List des Offres', listeOffre: results });
  });
});
/*router.get('/candidat', function (organisation, lieu, statut, salaire, type, intitule,req, res, next) { 
  result = candidatModel.readAllOffreFiltre (function (organisation, lieu, statut, salaire, type, intitule, result) {
    res.render('candidat', { title: 'List des Offres Filtres', users: result });
  });
});*/


module.exports = router;