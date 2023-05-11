var express = require('express');
var router = express.Router();
var orgaModel = require('../Modele/Organisation.js')
var candidatModel = require('../Modele/Candidat.js')
var communModel = require('../Modele/Commun.js')
var recruteurModel = require('../Modele/Recruteur.js');
const { urlencoded } = require('express');

router.get('/demandes', function (req, res, next) {
  var mail=req.session.userid;
  if(req.session.userid){
  
    candidatModel.readUserDmdRecruteur(mail, function (result) {
    //console.log("result:");
    //console.log(result);
    orgaModel.readOrga(function (orgaResult) {
      //console.log("orgaResult:");
      //console.log(orgaResult);
      candidatModel.readUserDmdAdmin(mail, function (adminResult) {
        //console.log("adminResult:");
        //console.log(adminResult);
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

    }else{
    if(req.session.userid){
      req.session.destroy();
    }
    res.render('connexion');
  }
});

router.post('/demandes/recruteur', function (req, res, next) {
  var mail=req.session.userid;

    var siren = req.body.choix; //renvoie le siren
    recruteurModel.readAllDmdRecruteur(siren, function (resultDmd) {
      if(resultDmd )
    candidatModel.creatDmdRecruteur(mail, siren, function (result) {
      console.log(result);
      if (result) {
        res.redirect('/recrut/demandes');
      } else {
        res.redirect('/recrut/demandes');
      }
    });
  });

});

router.post('/demandes/admin', function (req, res, next) {
  var mail=req.session.userid;
  
    candidatModel.creatDmdAdmin(mail, function (result) {
      if (result) {
        res.redirect('/recrut/demandes');
      } else {
        res.redirect('/recrut/demandes');
      }
    });
 
});

router.post('/demandes/adminSupp', function (req, res, next) {
  var mail=req.session.userid;
  var dateSupp = req.body['supp'];
  /*var date = new Date(dateSupp);
  var dateFormatted = date.toISOString().slice(0, 19).replace('T', ' ');*/
  console.log("Date à supprimer : " + dateSupp);
    candidatModel.deleteDmdAdmin(mail, dateSupp, function (result) {
      if (result) {
        res.redirect('/recrut/demandes');
      } else {
        res.redirect('/recrut/demandes');
      }
    });
 
});

router.get('/demandes/recruteurSupp/:siren', function (req, res, next) {
  var mail= req.session.userid;
  let siren = req.params.siren;
    candidatModel.deleteDmdRecruteurOrga(mail, siren, function (result) {
      if (result) {
        res.redirect('/recrut/demandes');
      } else {
        res.redirect('/recrut/demandes');
      }
    });
 
});

//on teste si l'utilisateur a les droits 
router.get('/recruteur', function (req, res, next) {
  if(req.session.userid||communModel.areRecruteur(req.session.userid)){
    var siren=req.session.orga;
    var mail=req.session.userid;
    result = recruteurModel.readAllOffreOrga (siren, function (results) {
    res.render('recruteur', { title: 'List des Offres', listeOffre: results });
  });
  }
  else if (!communModel.areRecruteur(req.session.userid)){
    res.redirect('/users/candidat');
  }else{
  res.redirect('/connexion');
  }
});

router.get('/creer_offre', function (req, res, next) {
  if(req.session.userid||communModel.areRecruteur(req.session.userid)){
    var siren=req.session.orga;
    var mail=req.session.userid;
   
    res.render('creer_offre');
  
  }
  else if (!communModel.areRecruteur(req.session.userid)){
    res.redirect('/users/candidat');
  }else{
  res.redirect('/connexion');
  }
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
    var etat = 'publiee';
    var organisation = req.session.orga;

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
    recruteurModel.deleteOffre(numero, function (result) {
      if (result) {
        res.redirect('/recrut/recruteur');
      } else {
        res.redirect('/recrut/recruteur');
      }
    });
 
});

router.get('/editer_offre/:numero', function (req, res, next) {
  let numero = req.params.numero;
    recruteurModel.readOffre(numero, function (result) {
      if (result) {
        res.render('editer_offre', {offre: result });
      } else {
        res.redirect('/recrut/recruteur');
      }
    });
 
});

router.post('/editer_offre', function (req, res, next) {
    if (req.body){
    console.log("body:");
    console.log(req.body);
    var etat = req.body.etat;
    var dateValidite = req.body.dateValidite;
    var pieces = req.body.pieces;
    var nombrePieces = req.body.nombrePieces;
    var numero = req.body.numero;
    var intitule = req.body.intitule;
    var statut = req.body.statut;
    var responsable = req.body.responsable;
    var type = req.body.type;
    var lieu = req.body.lieu;
    var rythme = req.body.rythme;
    var salaire = req.body.salaire;
    var description = req.body.description;
    
    recruteur.Model.updateOffre(etat, dateValidite, pieces, nombrePieces, numero, function (result) {
      recruteur.Model.updateFiche(intitule, statut, responsable, type, lieu, rythme, salaire, description, numero, function (result){
        res.redirect('/recrut/recruteur');
        console.log("update success");
      }); 
    });
  }
  res.redirect('/recrut/recruteur');
});

router.get('/profil_recruteur', function (req, res, next) {
  if(req.session.userid||communModel.areRecruteur(req.session.userid)){
    var mail=req.session.userid;
    var siren = req.session.orga;
    result = communModel.readUser(mail, function (user) {
      result = candidatModel.readOrga(siren, function (result) {
        res.render('profil_recruteur', { user: user, orga: result });
        });
    });
    }else
    res.render('connexion');
  
});
/*
if(req.session.userid||communModel.areRecruteur(req.session.userid)){
    var mail=req.session.userid;
    

    }else{
    if(req.session.userid){
      req.session.destroy();
    }
    res.render('connexion');
  }
*/
module.exports = router;
