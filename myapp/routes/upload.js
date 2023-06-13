var express = require('express');
var router = express.Router();

var multer = require('multer');  
const candidatModel = require('../Modele/Candidat.js');
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


/* GET */
router.get('/:numero', function(req, res, next) {
  if (req.session.userid){
    var mail = req.session.userid;
    readUser(mail, function (result){
        if (result) {
            var user = result;
            console.log(req.session.uploaded_files);
            if (req.session.uploaded_files == undefined ) {
                let numero = req.params.numero;
                console.log("1:",numero);
                console.log('Init uploaded files array');
                req.session.uploaded_files = [];
                res.render('file_upload',{req: req, connected_user : user, files_array : req.session.uploaded_files, numero});
            }else{
              res.redirect('/users/candidat');
            }

          } else {
            console.log("nononononon");
          }
    });
  }
  
});

/* POST : ajoute à l'objet request une propriété 'file', ayant une valeur unoiquement si le formulaire' contient un champ de type 'file' qui a pour nom 'myFileInput' */
router.post('/upload', upload.single('myFileInput') ,function(req, res, next) {
  const uploaded_file = req.file
  let numero = req.body.numero;
  console.log("2:",numero);
  console.log("3:",req.params.numero);
  console.log("4:",req.body);
  if (!uploaded_file) {
    res.render('file_upload',{req:req,connected_user : req.session.connected_user, files_array : req.session.uploaded_files, upload_error : 'Merci de sélectionner le fichier à charger !'});
  } else {
    console.log(uploaded_file.originalname,' => ',uploaded_file.filename);
    req.session.uploaded_files.push(uploaded_file.filename);
    var mail = req.session.userid;
    readUser(mail, function (result){
        if (result) {
            var user = result;
            console.log(user);
            console.log(result);
            console.log(user.prenom);
            res.render('file_upload',{req:req, numero, connected_user : user, files_array : req.session.uploaded_files, uploaded_filename : uploaded_file.filename, uploaded_original:uploaded_file.originalname});
          } else {
            console.log("nononononon");
          }
    });
  }
  

});
router.post('/envoi', function(req, res, next) {
    var fichier = req.session.uploaded_files.join(", ");
    console.log(fichier);
    mail = req.session.userid;
    numero = req.body.numero;
    console.log("envoie" , numero);
    candidatModel.creatCandidature(mail, numero, fichier, function(result){
      if (result){
        req.session.uploaded_files =undefined;
        res.redirect('/users/candidat');
        console.log("insertion reussie");
      }else{
        req.session.uploaded_files =undefined;
        res.redirect('/users/candidat');
        console.log("insertion fail");
      }
        
    });
    
  });
//rajouter une requete post qui insert la candidature avec les noms de fichiers


router.get('/getfile/:file', function(req, res, next) {
  console.log("le download");
  try {
    res.download('./mesfichiers/'+req.params.file);
  } catch (error) {
    res.send('Une erreur est survenue lors du téléchargement de '+req.params.file+' : '+error);
  }
});
router.get('/modifier_candidature/:numero', function (req, res, next) {
  var numero = req.params.numero;
  var mail = req.session.userid;  
  candidatModel.readCandidature(mail, numero, function (result) {
    if (result) {
      var candidat = result;      
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
        }else{
          console.log (req.session.uploaded_files, "les files upalode");
          console.log("DEJA INITIALIS2");
        }
        console.log (req.session.uploaded_files, "les files upalode");

        readUser(mail, function (user) {
          if(user){
            res.render('modifier_candidature',{req: req, connected_user : user, files_array : req.session.uploaded_files, numero});
          }else{
            res.redirect('/users/candidat');
            console.log("read user pas fonctionné");
          }
        });
    } else {
      console.log("non");
      res.redirect('/users/candidat/');
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
        console.log("reqghiZEOIHFVFHOIFDOIHFHIOFEIOHVFHGOIHF");
        //req.session.uploaded_files.splice(req.session.uploaded_files.indexOf(file), 1);
        const index = req.session.uploaded_files.indexOf(file);

        // Vérification si l'élément existe dans le tableau
        if (index > -1) {
          
          console.log(index, "oui il est dans le tableau");
          // Suppression de l'élément à l'index spécifié
          req.session.uploaded_files.splice(index, 1);
          console.log(req.session.uploaded_files);
          readUser(mail, function (result){
            if (result) {
                var user = result;
                console.log("CIdsCI");
  
                res.redirect('/candidature/modifier_candidature/'+ numero);
                //res.render('modifier_candidature',{req: req, connected_user : user, files_array : req.session.uploaded_files, numero : numero});
              } else {
                console.log("nononononon");
                res.redirect('/users/candidat');
              }
          });

          console.log('Le fichier a été supprimé avec succès.');


        }else{
          res.status(500).send('Une erreur s\'est produite lors de la suppression du fichierr.');

        }
        
        
        // Suppression réussie
        // Effectuez d'autres actions ou renvoyez une réponse appropriée ici
      }
    });
});
  
  router.post('/modifier_candidature/ajout', upload.single('myFileInput') ,function(req, res, next) {
    const uploaded_file = req.file
    let numero = req.body.numero;
    console.log("2:",numero);
    console.log("3:",req.params.numero);
    console.log("4:",req.body);
    if (!uploaded_file) {
      res.status(500).send('Une erreur s\'est produite lors de ajtou du fichier.');
      //res.render('modifier_candidature',{req:req,connected_user : req.session.connected_user, files_array : req.session.uploaded_files, upload_error : 'Merci de sélectionner le fichier à charger !'});
    } else {
      console.log(uploaded_file.originalname,' => ',uploaded_file.filename);
      req.session.uploaded_files.push(uploaded_file.filename);
      //res.render('modifier_candidature',{req:req, numero, connected_user : user, files_array : req.session.uploaded_files, uploaded_filename : uploaded_file.filename, uploaded_original:uploaded_file.originalname});
      res.redirect('/candidature/modifier_candidature/' +numero);
           
    }
  

});
router.post('/modifier_candidature/envoi', function(req, res, next) {
  var fichier = req.session.uploaded_files.join(", ");
  console.log(fichier);
  mail = req.session.userid;
  numero = req.body.numero;
  console.log("envoie" , numero);
  candidatModel.updateCandidature(fichier, mail, numero, function(result){
    if (result){
      res.redirect('/users/candidat');
      console.log("update fail reussie");
    }else{
      res.redirect('/users/candidat');
      console.log("update fail");
    }
      
  });
  
});

/*
const path = require('path');

router.get('/getfile', function(req, res, next) {
  try {
    const filePath = path.resolve(__dirname, '../mesfichiers', req.query.fichier_cible);
    res.download(filePath);
  } catch (error) {
    res.send('Une erreur est survenue lors du téléchargement de ' + req.query.fichier_cible + ' : ' + error);
  }
});*/
module.exports = router;
