var express = require('express');
var router = express.Router();

var multer = require('multer');  
const candidatModel = require('../Modele/Candidat.js');
const { readUser } = require('../Modele/Commun');
var middleware = require('../middleware')

router.use(middleware.isLoggedMiddleware);

// définition du répertoire de stockage des fichiers chargés (dans le répertoire du projet pour la démo, mais sur un espace dédié en prod !)
// et du nom sous lequel entregistrer le fichier
var my_storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, 'mesfichiers')},
  filename: function (req, file, cb) {
    let my_extension = file.originalname.slice(file.originalname.lastIndexOf(".")); // on extrait l'extension du nom d'origine du fichier
    cb(null, req.body.myUsername + '-' + req.body.myFileType+my_extension); // exemple de format de nommage : login-typedoc.ext
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
            if (req.session.uploaded_files == undefined || req.session.uploaded_files.length ===0 ) {
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
        res.redirect('/users/candidat');
        console.log("insertion reussie");
      }else{
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
