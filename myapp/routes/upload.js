var express = require('express');
var router = express.Router();

var multer = require('multer');  
const candidatModel = require('../Modele/Candidat.js');
const recruteurModel = require('../Modele/Recruteur.js');

const { readUser } = require('../Modele/Commun');
var middleware = require('../middleware')
const fs = require('fs');

router.use(middleware.isLoggedMiddleware);

// définition du répertoire de stockage des fichiers chargés (dans le répertoire du projet pour la démo, mais sur un espace dédié en prod !)
// et du nom sous lequel entregistrer le fichier
var my_storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, 'mesfichiers')},
  filename: function (req, file, cb) {
    let my_extension = file.originalname.slice(file.originalname.lastIndexOf(".")); // on extrait l'extension du nom d'origine du fichier
    cb(null, req.body.myUsername + '-' + req.body.myFileType+'-' + req.body.myAdd+my_extension); // exemple de format de nommage : login-typedoc.ext
  }
})

var upload = multer({ storage: my_storage }) 


router.get('/:numero', function(req, res, next) {
  let mail = req.session.userid;
  readUser(mail, function (result){
      if (result) {
          let user = result;
          if (req.session.uploaded_files == undefined ) {
              let numero = req.params.numero;
              console.log('Init uploaded files array');
              req.session.uploaded_files = [];
              res.render('file_upload',{req: req, connected_user : user, files_array : req.session.uploaded_files, numero});
          }else{
            res.redirect('/users/candidat');
          }
        } else {
          res.status(500).send('Une erreur s\'est produite lors de la lecture de l\'utilisateur.');
        }
  });
  
});

router.post('/upload', upload.single('myFileInput') ,function(req, res, next) {
  const uploaded_file = req.file
  let numero = req.body.numero;
  if (!uploaded_file) {
    res.render('file_upload',{req:req,connected_user : req.session.connected_user, files_array : req.session.uploaded_files, upload_error : 'Merci de sélectionner le fichier à charger !'});
  } else {
    console.log(uploaded_file.originalname,' => ',uploaded_file.filename);
    req.session.uploaded_files.push(uploaded_file.filename);
    let mail = req.session.userid;
    readUser(mail, function (user){
      if (user) {
          res.render('file_upload',{req:req, numero, connected_user : user, files_array : req.session.uploaded_files, uploaded_filename : uploaded_file.filename, uploaded_original:uploaded_file.originalname});
        } else {
          res.status(500).send('Une erreur s\'est produite lors de la lecture de l\'utilisateur.');
        }
    });
  }
});

router.post('/envoi', function(req, res, next) {
    let mail = req.session.userid;
    let numero = req.body.numero;
    recruteurModel.readOffre(numero, function(piece){
      if (piece>=req.session.uploaded_files.length){
        let fichier = req.session.uploaded_files.join(", ");
        candidatModel.creatCandidature(mail, numero, fichier, function(result){
          if (result){
            req.session.uploaded_files=undefined;
            res.redirect('/users/candidat');
            console.log("insertion reussie");
          }else{
            res.status(500).send('Une erreur s\'est produite lors de la lecture de l\'utilisateur.');
          }
        });
      }else{
        readUser(mail, function(user){
          if (user){
            res.render('file_upload',{req: req, connected_user : user, files_array : req.session.uploaded_files, numero, message : "Nombres de pièces de candidatures insuffisantes"});
          }
        })
      }
    });
    
    
  });

router.get('/getfile/:file', function(req, res, next) {
  try {
    res.download('./mesfichiers/'+req.params.file);
  } catch (error) {
    res.send('Une erreur est survenue lors du téléchargement de '+req.params.file+' : '+error);
  }
});

router.get('/modifier_candidature/:numero', function (req, res, next) {
  let numero = req.params.numero;
  let mail = req.session.userid;  
  candidatModel.readCandidature(mail, numero, function (candidat) {
    if (candidat) {
      if (req.session.uploaded_files == undefined ) {
          req.session.uploaded_files = [];
          if (candidat[0].piecesC.trim() === '') {
            console.log("tableau vide");
            console.log(candidat[0].piecesC, "le result de candidat");

          }else{
            req.session.uploaded_files = [];
            const mots = candidat[0].piecesC.split(","); // Sépare la chaîne en mots en utilisant la virgule comme séparateur
            candidat[0].piecesC = mots.map((mot) => mot.trim()); // Stocke chaque mot dans le tableau candidat.pieces après avoir supprimé les espaces avant et après
            candidat[0].piecesC.forEach(piece => {
            req.session.uploaded_files.push(piece);
            });
          }
      }
      readUser(mail, function (user) {
        if(user){
          res.render('modifier_candidature',{req: req, connected_user : user, files_array : req.session.uploaded_files, numero});
        }else{
          res.status(500).send('Une erreur s\'est produite lors de la lecture de l\'utilisateur.');
        }
      });
    } else {          
      res.status(500).send('Une erreur s\'est produite lors de la lecture de l\'utilisateur.');
    }
  });
});

router.get('/modifier_candidature/supp/:numero/:file', function (req, res, next) {
  let numero = req.params.numero;
  let file = req.params.file;
  let mail = req.session.userid;
  let filePath = './mesfichiers/'+file;
  const uploaded_file = req.file;
  console.log("CICI");

  fs.unlink(filePath, function (err) {
    if (err) {
      console.error(err);
      res.status(500).send('Une erreur s\'est produite lors de la suppression du fichier.');
    } else {
      const index = req.session.uploaded_files.indexOf(file);
      // Vérification si l'élément existe dans le tableau
      if (index > -1) {
        console.log(index, "oui il est dans le tableau");
        // Suppression de l'élément à l'index spécifié
        req.session.uploaded_files.splice(index, 1);
        res.redirect('/candidature/modifier_candidature/'+ numero);
        console.log('Le fichier a été supprimé avec succès.');
      }else{
        res.status(500).send('Une erreur s\'est produite lors de la suppression du fichier.');
      }
    }
  });
});
  
router.post('/modifier_candidature/ajout', upload.single('myFileInput') ,function(req, res, next) {
  const uploaded_file = req.file
  let numero = req.body.numero;
  if (!uploaded_file) {
    res.status(500).send('Une erreur s\'est produite lors de ajout du fichier.');
  } else {
    console.log(uploaded_file.originalname,' => ',uploaded_file.filename);
    req.session.uploaded_files.push(uploaded_file.filename);
    res.redirect('/candidature/modifier_candidature/' +numero);
  }
});

router.post('/modifier_candidature/envoi', function(req, res, next) {
  let fichier = req.session.uploaded_files.join(", ");
  let mail = req.session.userid;
  let numero = req.body.numero;
  candidatModel.updateCandidature(fichier, mail, numero, function(result){
    if (result){
      res.redirect('/users/candidat');
      console.log("update reussie");
    }else{
      res.status(500).send('Une erreur s\'est produite lors de l\'update des données.');
    }    
  });
});

router.get('/supp/:numero', function (req, res, next){
  let numero = req.params.numero;
  let mail = req.session.userid;
  let filePath = './mesfichiers/';
  candidatModel.readCandidature(mail, numero, function (result) {
    if (result) {
        var candidat = result;      
        let files=[];
        const mots = candidat[0].piecesC.split(","); // Sépare la chaîne en mots en utilisant la virgule comme séparateur
        candidat[0].piecesC = mots.map((mot) => mot.trim()); // Stocke chaque mot dans le tableau candidat.pieces après avoir supprimé les espaces avant et après
        candidat[0].piecesC.forEach(piece => {
        files.push(piece);
        });
        if(files!= []){
          files.forEach(file=>{
            filePath = './mesfichiers/'+file;
            fs.unlink(filePath, function (err) {
              if (err){
                res.status(500).send('Une erreur s\'est produite lors de la suppression du fichier.');
              }
            });
          });
        
        }
        candidatModel.deleteCandidature(mail, numero, function (supp) {
          if (supp){
            res.redirect('/users/profil_candidat');
          }else{
            res.status(500).send('Une erreur s\'est produite lors de la suppression de la candidature.');
          }
        });

      }else{
        res.status(500).send('Une erreur s\'est produite lors de la lecture de la candidature.');
      }
    });
});

module.exports = router;
