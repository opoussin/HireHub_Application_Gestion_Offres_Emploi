const express = require('express');
const router = express.Router();
const candidatModel = require('../Modele/Candidat.js')
const communModel = require('../Modele/Commun.js')
const recruteurModel = require('../Modele/Recruteur.js')
const adminModel = require('../Modele/Administrateur.js')
const { urlencoded } = require('express');
const middleware = require('../middleware')
const escape = require('escape-html');


router.use(middleware.isLoggedMiddleware);
router.use(middleware.isRecruteurMiddleware);

//res.status(404).send('Une erreur s\'est produite lors de la lecture des données.');


router.get('/recruteur', function (req, res, next) {

  let mail = req.session.userid;
  req.session.current_profil = 2; //à quoi ça sert? On peut l'enlever si on utilise le nouveau header??
  let candidat = "";
  let o_exp = req.query.o_exp;
  let orga = req.query.orga;
  let intitule = req.query.intitule;
  let date = req.query.date;

  recruteurModel.readAllOffreOrgaRecrut(mail, orga, intitule, date, o_exp, function (results) {
    if (results) {
      recruteurModel.readAllOrgaRecruteur(mail, function (orgaResult) {
        if (orgaResult) {
          res.render('recruteur', {
            candidat: candidat, listeOffre: results, orgaResult: orgaResult, req: req, search: {
              o_exp: o_exp, orga: orga, intitule: intitule, date: date
            }
          });
        } else {
          res.status(404).send('Une erreur s\'est produite lors de la lecture des données des organisations du recruteur.');
        }

      });
    } else {
      res.status(404).send('Une erreur s\'est produite lors de la lecture des données des offres des organisations.');

    }

  });

});

router.get('/creer_offre', function (req, res, next) {
  let mail = req.session.userid;
  recruteurModel.readAllOrgaRecruteur(mail, function (orgaResult) {
    if (orgaResult && orgaResult.length > 0) {
      res.render('creer_offre', { req: req, orgaResult: orgaResult });
    } else {
      res.status(404).send('Une erreur s\'est produite lors de la lecture des données des organisations du recruteurs.');
    }

  })
});

router.post('/creer_offre', function (req, res, next) {
  // Récupération des données du formulaire
  let dateValidite = escape (req.body.dateValidite);
  let pieces = escape (req.body.pieces);
  let nombrePieces = escape (req.body.nombrePieces);
  let intitule = escape (req.body.intitule);
  let statut = escape (req.body.statut);
  let responsable = escape( req.body.responsable);
  let type = escape (req.body.type);
  let lieu = escape (req.body.lieu);
  let rythme = escape (req.body.rythme);
  let salaire = escape( req.body.salaire);
  let description = escape (req.body.description);
  let etat = escape (req.body.etat);
  let organisation = escape (req.body.siren);

  // Appel à la fonction creat du modèle Utilisateur
  recruteurModel.creatOffre(organisation, etat, dateValidite, pieces, nombrePieces, intitule, statut, responsable, type, lieu, rythme, salaire, description, function (result) {
    if (result) { //result = vrai donc il y a une erreur
      res.redirect('./recruteur');
    }
    else {
      res.status(404).send('Une erreur s\'est produite lors de la création des données.');
    }
  });
});

router.get('/supp_offre/:numero', function (req, res, next) {
  let numero = req.params.numero;
  recruteurModel.readOffre(numero, function (offre) {
    if (offre && offre.legnth > 0) {
      //verification de l'appartenance à l'organisation
      let appartient = false;
      req.session.orga.forEach((org) => {

        if (org.organisation == offre.organisation) {
          appartient = true;
        }
      })
      if (appartient) {
        // verifie que l'offre appartient bien à une des entreprises de l'utilisateur  
        recruteurModel.deleteOffre(numero, function (result) {
          if (result) {
            console.log("suppression réussie");
            res.redirect('/recrut/recruteur');
          } else {
            res.status(404).send('Une erreur s\'est produite lors de la suppression des données.');
          }
        });
      } else {
        res.status(404).redirect('/recrut/recruteur');
      }
    } else {
      res.status(404).redirect('/recrut/recruteur');
    }
  });


});

router.get('/editer_offre/:numero', function (req, res, next) {
  let numero = req.params.numero;
  recruteurModel.readOffre(numero, function (results) {
    if (results && results.length > 0) {
      let result = results[0];
      //verification de l'appartenance à l'organisation
      let appartient = false;
      req.session.orga.forEach((org) => {
        if (org.organisation == result.organisation) {
          appartient = true;
        }
      })
      if (appartient) {
        communModel.readOrga(result.organisation, function (orgaResult) {
          if (orgaResult) {
            let orga = orgaResult[0];
            res.render('editer_offre', { offre: result, orga: orga, req: req, numero });
          }
        });
      } else {
        res.status(404).redirect('/recrut/recruteur');
      }
    } else {
      res.status(404).send('Cette offre n\' existe pas ou vous n\'y avez pas accès.');
    }
  });
});

router.get('/listeCandidat/:numero', function (req, res, next) {
  let numero = req.params.numero;
  recruteurModel.readOffre(numero, function (offre) {
    if (offre && offre.length > 0) {
      //verification de l'appartenance à l'organisation
      let appartient = false;
      req.session.orga.forEach((org) => {
        if (org.organisation == offre[0].organisation) {
          appartient = true;
        }
      })
      if (appartient) {
        recruteurModel.readAllCandidat(numero, function (result) {
          if (result) {
            result.forEach((candidat) => {
              const mots = candidat.piecesC.split(","); // Sépare la chaîne en mots en utilisant la virgule comme séparateur
              candidat.piecesC = mots.map((mot) => mot.trim()); // Stocke chaque mot dans le tableau candidat.pieces après avoir supprimé les espaces avant et après
            });

            res.render('listeCandidat', { numero, candidats: result, req: req });
          } else {
            res.status(404).send('Cette offre n\' existe pas ou vous n\'y avez pas accès.');
          }
        });
      } else {
        res.status(401).redirect('/recrut/recruteur');
      }
    } else {
      res.status(404).redirect('/recrut/recruteur');
    }
  });
});

router.post('/editer_offre/:numero', function (req, res, next) {
  if (req.body) {
    if (req.body.dateValidite2) {
      let dateValidite = req.body.dateValidite2;

    } else {
      let dateValidite = req.body.dateValidite1;

    }
    //let dateValidite = new Date( req.body.dateValidite);
    //console.log("req.body:",dateValidite);
    //let dateValidite = req.body.dateValidite;

    //let dateValidite = dateValidite.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join('-');
    let numero = req.params.numero;
    let pieces = escape (req.body.pieces);
    let nombrePieces = escape (req.body.nombrePieces);
    let intitule = escape (req.body.intitule);
    let statut = escape (req.body.statut);
    let responsable = escape( req.body.responsable);
    let type = escape (req.body.type);
    let lieu = escape (req.body.lieu);
    let rythme = escape (req.body.rythme);
    let salaire = escape( req.body.salaire);
    let description = escape (req.body.description);
    let etat = escape (req.body.etat);
    recruteurModel.updateOffre(etat, dateValidite, pieces, nombrePieces, numero, function (result) {
      if (result) {
        recruteurModel.updateFiche(intitule, statut, responsable, type, lieu, rythme, salaire, description, numero, function (results) {
          if (results) {
            res.redirect('/recrut/recruteur');
            console.log("update success");
          } else {
            res.status(404).send('Une erreur s\'est produite lors de la mise à jour des données.');
          }
        });
      } else {
        res.status(404).send('Une erreur s\'est produite lors de la mise à jour des données.');
      }
    });
  }
});

router.get('/profil_recruteur', function (req, res, next) {
  let mail = req.session.userid;
  communModel.readUser(mail, function (user) {
    if (user) {
      res.render('profil_recruteur', { user: user, organisations: req.session.orga, req: req });
    } else {
      res.status(404).send('Une erreur s\'est produite lors de la lecture des données.');
    }
  });
});

router.get('/demandes', async function (req, res, next) {
  let orgas = req.session.orga;
  let siren_choix = req.query.choix_orga;
  let date = req.query.date;
  let mail = req.query.mail;

  recruteurModel.readAllDmdRecruteur(orgas, siren_choix, date, mail, function (result) {
    if (result) {
      res.render('recrut_demandes', { demandesRecruteur: result, organisation: orgas, req: req, search: { choix_orga: siren_choix, date: date, mail: mail } });
    } else {
      res.status(404).send('Une erreur s\'est produite lors de la lecture des données.');
    }
  });
});

router.get('/demandes/accept', function (req, res, next) {
  let user = req.query.user;
  let siren = req.query.siren;
  let value = true;
  adminModel.acceptRecruteur(user, siren, function (accept) {
    if (accept) {
      adminModel.updateDmdRecruteur(siren, user, value, function (update) {
        if (update) {
          console.log(" La demande de l'utilisateur ", user, "pour rejoindre l'organisation de siren", siren, "a été acceptée");
          res.redirect('/recrut/demandes');
        } else {
          res.status(404).send('Une erreur s\'est produite lors de l\'update');
        }
      });
    } else {
      res.status(404).send('Une erreur s\'est produite lors de l\'acceptation');

    }
  });
});

router.get('/demandes/deny', function (req, res, next) {
  let user = req.query.user;
  let siren = req.query.siren;
  let value = false;

  adminModel.updateDmdRecruteur(siren, user, value, function (result) {
    if (result) {
      // console pour simuler l'envoi d'un mail de notification 
      console.log(" La demande de l'utilisateur ", user, "pour rejoindre l'organisation de siren", siren, "a été refusée");

      res.redirect('/recrut/demandes');
    } else {
      res.status(404).send('Une erreur s\'est produite lors de la mise a jour des données.');
    }
  });
});

router.get('/listeCandidat/accept/:numero/:candidat', function (req, res, next) {
  let numero = req.params.numero;
  let mail = req.params.candidat;
  recruteurModel.readOffre(numero, function (offre) {
    if (offre) {
      //verification de l'appartenance à l'organisation
      let appartient = false;
      req.session.orga.forEach((org) => {
        if (org.organisation == offre[0].organisation) {
          appartient = true;
        }
      })
      if (appartient) {
        recruteurModel.acceptCandidat(numero, mail, function (result) {
          if (result) {
            res.redirect('/recrut/listeCandidat/' + numero);
          } else {
            res.status(404).send('Une erreur s\'est produite lors de l\'acceptation');
          }
        });
      } else {
        res.status(404).redirect('/recrut/recruteur');
      }
    } else {
      res.status(404).redirect('/recrut/recruteur');
    }
  });
});

router.get('/listeCandidat/refuse/:numero/:candidat', function (req, res, next) {
  let numero = req.params.numero;
  let mail = req.params.candidat;
  recruteurModel.readOffre(numero, function (offre) {
    if (offre) {
      //verification de l'appartenance à l'organisation
      let appartient = false;
      req.session.orga.forEach((org) => {
        if (org.organisation == offre[0].organisation) {
          appartient = true;
        }
      })
      if (appartient) {
        recruteurModel.refuseCandidat(numero, mail, function (result) {
          if (result) {
            res.redirect('/recrut/listeCandidat/' + numero);
          } else {
            res.status(404).send('Une erreur s\'est produite lors du refus');
          }
        });
      } else {
        res.status(404).redirect('/recrut/recruteur');
      }
    } else {
      res.status(404).redirect('/recrut/recruteur');
    }
  });
});

module.exports = router;
