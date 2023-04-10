var express = require('express');
var router = express.Router();
var userModel = require('../Modele/Utilisateur.js')

/* GET users listing. */
router.get('/', function (req, res, next) {
res.send('respond with a resource');
});

/*La deuxième route utilise également la méthode HTTP GET pour l'URL "/userslist"*/
router.get('/userslist', function (req, res, next) { //route de readAll 
  result=userModel.readall(function(result){
    res.render('usersList', { title: 'List des utilisateurs', users: result }); 
    /*vue userList, le deuxième paramètre de render est un objet qui contient toutes les variables qui seront utilisées dans la vue. */
  });
});

router.get('/connexion', function (req, res, next) { 
  result=userModel.read(function(result){
    res.render('Connexion', {users: result }); 
  });
});

module.exports = router;