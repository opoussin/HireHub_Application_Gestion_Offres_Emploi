var express = require('express');
var router = express.Router();
var candidatModel = require('../Modele/Candidat.js')
var communModel = require('../Modele/Commun.js')
var recruteurModel = require('../Modele/Recruteur.js')
var adminModel = require('../Modele/Administrateur.js')
const { urlencoded } = require('express');
var middleware = require('../middleware')

router.use(middleware.isLoggedMiddleware);
router.use(middleware.isRecruteurMiddleware);

//res.status(500).send('Une erreur s\'est produite lors de la lecture des données.');


router.get('/recruteur', function (req, res, next) {

    var mail=req.session.userid;
    req.session.current_profil=2; //à quoi ça sert? On peut l'enlever si on utilise le nouveau header??
    var candidat = "";
    var o_exp = req.query.o_exp;
    var orga = req.query.orga;
    var intitule = req.query.intitule;
    var date = req.query.date;
    
    recruteurModel.readAllOffreOrgaRecrut (mail, orga, intitule, date, o_exp, function (results) {
      if (results){
        recruteurModel.readAllOrgaRecruteur(mail, function(orgaResult){
        if (orgaResult){
          res.render('recruteur', {candidat : candidat, listeOffre: results ,orgaResult: orgaResult, req : req, search:{
          o_exp: o_exp, orga:orga, intitule:intitule, date:date}});
        }else{
          res.status(500).send('Une erreur s\'est produite lors de la lecture des données des organisations du recruteur.');
        }
        
      });
      }else{
        res.status(500).send('Une erreur s\'est produite lors de la lecture des données des offres des organisations.');

      }
      
  });
  
});

router.get('/creer_offre', function (req, res, next) {
    var mail=req.session.userid;
    console.log("user" + mail);
    recruteurModel.readAllOrgaRecruteur(mail, function(orgaResult){
      if (orgaResult){
        console.log("orga result", orgaResult);
        res.render('creer_offre', {req : req, orgaResult: orgaResult});
      }else{
        res.status(500).send('Une erreur s\'est produite lors de la lecture des données des organisations du recruteurs.');
      }
      
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

  // Appel à la fonction creat du modèle Utilisateur
  recruteurModel.creatOffre(organisation, etat, dateValidite, pieces, nombrePieces, intitule, statut, responsable, type, lieu, rythme, salaire, description, function (result) {
    if (result){ //result = vrai donc il y a une erreur
      res.redirect('./recruteur');
    }
    else{
      res.status(500).send('Une erreur s\'est produite lors de la création des données.');
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
  recruteurModel.readOffre(numero, function(offre){
    if (offre){
      //verification de l'appartenance à l'organisation
      console.log(result);
      console.log(result.organisation);
      let appartient = false;
      req.session.orga.forEach((org) => {
        console.log(org);
        console.log(org.organisation);

        if (org.organisation == offre.organisation){
          appartient = true; 
        }
      })
      console.log (appartient);
      console.log (req.session);
      if (appartient){
        // verifie que l'offre appartient bien à une des entreprises de l'utilisateur  
        recruteurModel.deleteOffre(numero, function (result) {
        if (result) {
          console.log ("suppression réussie");
          res.redirect('/recrut/recruteur');
        } else {
          res.status(500).send('Une erreur s\'est produite lors de la suppression des données.');
        }
        });
        }else{
          //gerer l'erreur
        }
      }else{
        //gerer l'erreur
      }
    });
    
 
});


router.get('/editer_offre/:numero', function (req, res, next) {
  let numero = req.params.numero;
  recruteurModel.readOffre(numero, function (results) {
    var result = results[0];
    if (result) {
      //verification de l'appartenance à l'organisation
      console.log(result);
      console.log(result.organisation);
      let appartient = false;
      req.session.orga.forEach((org) => {
        console.log(org);
        console.log(org.organisation);

        if (org.organisation == result.organisation){
          appartient = true; 
        }
      })
      console.log (appartient);
      console.log (req.session);
      if (appartient){
      communModel.readOrga(result.organisation, function(orgaResult){
        if(orgaResult){
          var orga = orgaResult[0];
          res.render('editer_offre', {offre: result, orga: orga, req : req, numero});
        }
      });
    }else{
      res.redirect('/recrut/recruteur');
    }
    } else {
      res.status(500).send('Une erreur s\'est produite lors de la modification des données.');
    }
  });
});

router.get('/listeCandidat/:numero', function (req, res, next) {
  let numero = req.params.numero;
  recruteurModel.readOffre(numero, function(offre){
    if (offre){
      //verification de l'appartenance à l'organisation
      console.log(offre);
      console.log(offre[0].organisation);
      let appartient = false;
      req.session.orga.forEach((org) => {
        console.log(org);
        console.log(org.organisation);

        if (org.organisation == offre[0].organisation){
          appartient = true; 
        }
      })
      console.log (appartient);
      console.log (req.session);
      if (appartient){
        recruteurModel.readAllCandidat(numero, function (result) {
          if (result) {
            result.forEach((candidat) => {
              const mots = candidat.piecesC.split(","); // Sépare la chaîne en mots en utilisant la virgule comme séparateur
              candidat.piecesC = mots.map((mot) => mot.trim()); // Stocke chaque mot dans le tableau candidat.pieces après avoir supprimé les espaces avant et après
              console.log(candidat.piecesC);
            });

            res.render('listeCandidat', { numero, candidats: result, req: req });
          } else {
            res.status(500).send('Une erreur s\'est produite lors de la lecture des données.');
          }
        });
      }else{
        res.redirect('/recrut/recruteur');
      }
    }
    });
});

router.post('/editer_offre/:numero', function (req, res, next) {
  if (req.body){
    var etat = req.body.etat;
    var dateValidite = new Date(req.body.dateValidite);
    dateValidite = dateValidite.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join('-');
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
    var etat = req.body.etat;
    console.log("req.body:",req.body);
    recruteurModel.updateOffre(etat, dateValidite, pieces, nombrePieces, numero, function (result) {
      recruteurModel.updateFiche(intitule, statut, responsable, type, lieu, rythme, salaire, description, numero, function (result){
        res.redirect('/recrut/recruteur');
        console.log("update success");
      }); 
    });
  }
});

router.get('/profil_recruteur', function (req, res, next) {
    var mail=req.session.userid;
    communModel.readUser(mail, function (user) {
      if (user){
        res.render('profil_recruteur', { user: user, organisations: req.session.orga , req : req});
      }else{
        res.status(500).send('Une erreur s\'est produite lors de la lecture des données.');
      }
    });
});

router.get('/demandes', async function(req, res, next) {
    var orgas = req.session.orga;
    let siren_choix = req.query.choix_orga;
    let date = req.query.date;
    let mail = req.query.mail;

    recruteurModel.readAllDmdRecruteur(orgas, siren_choix, date, mail, function(result){
    if (result){
      res.render('recrut_demandes', { demandesRecruteur: result, organisation: orgas, req : req, search:{choix_orga: siren_choix, date:date, mail:mail}});
    }else{
      res.status(500).send('Une erreur s\'est produite lors de la lecture des données.');
    }
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
          console.log ( " La demande de l'utilisateur ", user, "pour rejoindre l'organisation de siren", siren , "a été acceptée");
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
  let user = req.query.user;
  let siren=req.query.siren;
  let value=false;
  
    adminModel.updateDmdRecruteur(siren,user, value, function (result) {
      if (result){
        // console pour simuler l'envoi d'un mail de notification 
      console.log ( " La demande de l'utilisateur ", user, "pour rejoindre l'organisation de siren", siren , "a été refusée");

      res.redirect('/recrut/demandes');
      }else{
        res.status(500).send('Une erreur s\'est produite lors de la mise a jour des données.');
      }    
    });
});

router.get('/listeCandidat/accept/:numero/:candidat', function (req, res, next) {
  let numero = req.params.numero;
  let mail = req.params.candidat;  
  recruteurModel.readOffre(numero, function(offre){
    if (offre){
      //verification de l'appartenance à l'organisation
      console.log(offre);
      console.log(offre[0].organisation);
      let appartient = false;
      req.session.orga.forEach((org) => {
        console.log(org);
        console.log(org.organisation);

        if (org.organisation == offre[0].organisation){
          appartient = true; 
        }
      })
      console.log (appartient);
      console.log (req.session);
      if (appartient){
        recruteurModel.acceptCandidat(numero, mail, function (result) {
          if (result){
            res.redirect('/recrut/listeCandidat/' +numero);
          }else{
            res.status(500).send('Une erreur s\'est produite lors de l\'acceptation');
          }
        });
      }else{
        res.redirect('/recrut/recruteur');
      }
    }
  });
});

router.get('/listeCandidat/refuse/:numero/:candidat', function (req, res, next) {
  let numero = req.params.numero;
  let mail = req.params.candidat;
  recruteurModel.readOffre(numero, function(offre){
    if (offre){
      //verification de l'appartenance à l'organisation
      console.log(offre);
      console.log(offre[0].organisation);
      let appartient = false;
      req.session.orga.forEach((org) => {
        console.log(org);
        console.log(org.organisation);

        if (org.organisation == offre[0].organisation){
          appartient = true; 
        }
      })
      console.log (appartient);
      console.log (req.session);
      if (appartient){  
        recruteurModel.refuseCandidat(numero, mail, function (result) {
          if (result){
            res.redirect('/recrut/listeCandidat/' +numero);
          }else{
            res.status(500).send('Une erreur s\'est produite lors du refus');
          }
        });
      }else{
        res.redirect('/recrut/recruteur');
      }
    }
  });
});

module.exports = router;
