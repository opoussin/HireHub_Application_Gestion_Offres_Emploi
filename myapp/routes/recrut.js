var express = require('express');
var router = express.Router();
var orgaModel = require('../Modele/Organisation.js')
var candidatModel = require('../Modele/Candidat.js')
var communModel = require('../Modele/Commun.js')
var recruteurModel = require('../Modele/Recruteur.js')
var adminModel = require('../Modele/Administrateur.js')
const { urlencoded } = require('express');
var middleware = require('../middleware')

router.use(middleware.isLoggedMiddleware);
router.use(middleware.isRecruteurMiddleware);


router.get('/recruteur', function (req, res, next) {
    //var siren=req.session.orga;

    var mail=req.session.userid;
    req.session.current_profil=2; //à quoi ça sert? On peut l'enlever si on utilise le nouveau header??
    var candidat = "";

    var orga = req.query.orga;
    var intitule = req.query.intitule;
    var date = req.query.date;
    
    recruteurModel.readAllOffreOrgaRecrut (mail, orga, intitule, date, function (results) {
      recruteurModel.readAllOrgaRecruteur(mail, function(orgaResult){
        res.render('recruteur', {candidat : candidat, listeOffre: results ,orgaResult: orgaResult, req : req, search:{
          orga:orga, intitule:intitule, date:date}
        });
      });
  });
  
});

router.get('/creer_offre', function (req, res, next) {
    var siren=req.session.orga;
    var mail=req.session.userid;
    console.log("user" + mail);
    recruteurModel.readAllOrgaRecruteur(mail, function(orgaResult){
      console.log("orga result", orgaResult);
      res.render('creer_offre', {req : req, orgaResult: orgaResult});
    })
});

router.post('/creer_offre', function (req, res, next) {
  // Récupération des données du formulaire
    var etat = req.body.etat;
    var dateValidite = req.body.dateValidite;
    var pieces = req.body.pieces;
    var nombrePieces = req.body.nombrePieces;
    var intitule = req.body.intitule;
    var statut = req.body.statut;
    var responsable = req.body.responsable;
    var type = req.body.type;
    var lieu = req.body.lieu;
    var rythme = req.body.rythme;
    var salaire = req.body.salaire;
    var description = req.body.description;
    var etat = req.body.etat;


    var organisation = req.body.siren;
    console.log("orga", organisation);

  // Appel à la fonction creat du modèle Utilisateur
  recruteurModel.creatOffre(organisation, etat, dateValidite, pieces, nombrePieces, intitule, statut, responsable, type, lieu, rythme, salaire, description, function (result) {
    if (result){ //result = vrai donc il y a une erreur
      res.redirect('./recruteur');
    }
    else{
      res.redirect('./recruteur');
    }
  });
});

router.get('/logout',(req,res) => {
  req.session.destroy();
  res.redirect('/');
});

router.get('/supp_offre/:numero', function (req, res, next) {
  let numero = req.params.numero;
  console.log( " numeor a supp ", numero)
    recruteurModel.deleteOffre(numero, function (result) {
      if (result) {
        console.log ("suppression réussie");
        res.redirect('/recrut/recruteur');
      } else {
        res.redirect('/recrut/recruteur');
      }
    });
 
});


router.get('/editer_offre/:numero', function (req, res, next) {
  let numero = req.params.numero;
  console.log("numero", numero);
    recruteurModel.readOffre(numero, function (results) {
      console.log(result);
      var result = results[0];
      if (result) {
        //console.log("deuxieemfoosi", result);
        communModel.readOrga(result.organisation, function(orgaResult){
          if(orgaResult){
            var orga = orgaResult[0];
            console.log("numerooooooooooooooooooo", numero);
            res.render('editer_offre', {offre: result, orga: orga, req : req, numero});
          }
        });
      } else {
        res.redirect('/recrut/recruteur');
      }
    });
 
});

router.get('/listeCandidat/:numero', function (req, res, next) {
  let numero = req.params.numero;
  recruteurModel.readAllCandidat(numero, function (result) {
    if (result) {
      console.log("oui");
      result.forEach((candidat) => {
        const mots = candidat.piecesC.split(","); // Sépare la chaîne en mots en utilisant la virgule comme séparateur
        candidat.piecesC = mots.map((mot) => mot.trim()); // Stocke chaque mot dans le tableau candidat.pieces après avoir supprimé les espaces avant et après
        console.log(candidat.piecesC);
      });

      res.render('listeCandidat', { numero, candidats: result, req: req });
    } else {
      console.log("non");
      res.redirect('/recrut/recruteur');
    }
  });
});

router.post('/editer_offre/:numero', function (req, res, next) {
  if (req.body){
    var etat = req.body.etat;
    var dateValidite = req.body.dateValidite;
    var pieces = req.body.pieces;
    var nombrePieces = req.body.nombrePieces;
    let numero = req.params.numero;
    var intitule = req.body.intitule;
    var statut = req.body.statut;
    var responsable = req.body.responsable;
    var type = req.body.type;
    var lieu = req.body.lieu;
    var rythme = req.body.rythme;
    var salaire = req.body.salaire;
    var description = req.body.description;
    
    console.log("req.body:",req.body);
    recruteurModel.updateOffre(etat, dateValidite, pieces, nombrePieces, numero, function (result) {
      recruteurModel.updateFiche(intitule, statut, responsable, type, lieu, rythme, salaire, description, numero, function (result){
        res.redirect('/recrut/recruteur');
        console.log("update success");
      }); 
    });
  }
  res.redirect('/recrut/recruteur');
});

router.get('/profil_recruteur', function (req, res, next) {
    var mail=req.session.userid;
    var siren = req.session.orga;
    communModel.readUser(mail, function (user) {
      
      res.render('profil_recruteur', { user: user, organisations: req.session.orga , req : req});
    });
});

router.get('/demandes', async function(req, res, next) {
    var mail = req.session.userid;
    var orgas = req.session.orga;
    recruteurModel.readAllDmdRecruteur(orgas, function(result){
      res.render('recrut_demandes', { demandesRecruteur: result, organisation: orgas, req : req});
    });
    
});

router.get('/demandes/accept', function (req, res, next) {
  let user = req.query.user;
  let siren=req.query.siren;
  let value = true;
  adminModel.acceptRecruteur(user,siren, function (accept) {
    adminModel.updateDmdRecruteur(siren, user, value, function (update) {
      if (accept){
        if(update){
          res.redirect('/recrut/demandes');
        }else{
          res.status(500).send('Une erreur s\'est produite lors de l\'update');
        }
      }else{
        res.status(500).send('Une erreur s\'est produite lors de l\'acceptation');

      }
      
    });
  });
});

router.get('/demandes/deny', function (req, res, next) {
  var mail= req.session.userid;
  let user = req.query.user;
  let siren=req.query.siren;
  let value=false;
  
    adminModel.updateDmdRecruteur(siren,user, value, function (result) {

      res.redirect('/recrut/demandes');
      
    });
});

router.get('/listeCandidat/accept/:numero/:candidat', function (req, res, next) {
  var numero = req.params.numero;
  var mail = req.params.candidat;  
  recruteurModel.acceptCandidat(numero, mail, function (result) {
    if (result){
      console.log("Votre candidature a été acceptée");
      res.redirect('/recrut/listeCandidat/' +numero);
    }else{
      res.status(500).send('Une erreur s\'est produite lors de l\'acceptation');

    }
    
  });

});

router.get('/listeCandidat/refuse/:numero/:candidat', function (req, res, next) {
  var numero = req.params.numero;
  var mail = req.params.candidat;  
  recruteurModel.refuseCandidat(numero, mail, function (result) {
    if (result){
      console.log("Votre candidature a été refusée");
      res.redirect('/recrut/listeCandidat/' +numero);
    }else{
      res.status(500).send('Une erreur s\'est produite lors du refus');

    }
    
  });

});

module.exports = router;
