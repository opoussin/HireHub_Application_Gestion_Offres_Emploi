var express = require('express');
var router = express.Router();
var userModel = require('../Modele/user.js')

/* GET users listing. */
router.get('/', function (req, res, next) {
res.render('candidat');
});

/*La deuxième route utilise également la méthode HTTP GET pour l'URL "/userslist"*/
router.get('/userslist', function (req, res, next) { //route de readAll 
  result=userModel.readall(function(result){
    res.render('usersList', { title: 'List des utilisateurs', users: result }); 
    /*vue userList, le deuxième paramètre de render est un objet qui contient toutes les variables qui seront utilisées dans la vue. */
  });
});

module.exports = router;