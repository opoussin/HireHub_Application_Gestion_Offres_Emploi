var express = require('express');
var router = express.Router();

var multer = require('multer');  
const { creatCandidature } = require('../Modele/Candidat');
const { readUser } = require('../Modele/Commun');

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
    let numero = req.params.numero;
  if (req.session.userid){
    var mail = req.session.userid;
    readUser(mail, function (result){
        if (result) {
            var user = result;
            console.log(user);
            console.log(result);
            console.log(user.prenom);

            //req.session.connected_user.prenom = user.prenom;
              //  req.session.connected_user.nom = user.nom;
            if (req.session.uploaded_files == undefined) {
                console.log('Init uploaded files array');
                req.session.uploaded_files = [];
                res.render('file_upload',{connected_user : user, files_array : req.session.uploaded_files, numero});
            }

          } else {
            console.log("nononononon");
          }
    });
  }
  
//pas compriss
  //rajouter un readOffre pour afficher : votre candidature à telle offre
});

/* POST : ajoute à l'objet request une propriété 'file', ayant une valeur unoiquement si le formulaire' contient un champ de type 'file' qui a pour nom 'myFileInput' */
router.post('/:numero', upload.single('myFileInput') ,function(req, res, next) {
  const uploaded_file = req.file
  let numero = req.params.numero;
    console.log(numero);
  if (!uploaded_file) {
    res.render('file_upload',{connected_user : req.session.connected_user, files_array : req.session.uploaded_files, upload_error : 'Merci de sélectionner le fichier à charger !'});
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
            res.render('file_upload',{numero : numero, connected_user : user, files_array : req.session.uploaded_files, uploaded_filename : uploaded_file.filename, uploaded_original:uploaded_file.originalname});
          } else {
            console.log("nononononon");
          }
    });
  }
  

});
router.post('/envoi/:numero', function(req, res, next) {
    var fichier = req.session.uploaded_files.join(", ");
    console.log(uploadedFilesString);
    mail = req.session.userid;
    numero = req.params.numero;
    creatCandidature(mail, numero, fichier, function(result){
        res.redirect('/users/candidat');
        console.log("insertion reussie");
    });
    
  });
//rajouter une requete post qui insert la candidature avec les noms de fichiers

/* GET download */
router.get('/getfile', function(req, res, next) {
  try {
    res.download('./mesfichiers/'+req.query.fichier_cible);
  } catch (error) {
    res.send('Une erreur est survenue lors du téléchargement de '+req.query.fichier_cible+' : '+error);
  }
});

module.exports = router;
