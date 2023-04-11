var express = require('express');
var router = express.Router();
var userModel = require('../Modele/user.js')

/* 
router.get('/', function (req, res, next) {
res.render('candidat');
});*/

router.get('/candidat', function (req, res, next) {
  res.render('candidat');
});

router.get('/recruteur', function (req, res, next) {
  res.render('recruteur');
});

router.get('/administrateur', function (req, res, next) {
  res.render('admin');
});


/*La deuxième route utilise également la méthode HTTP GET pour l'URL "/userslist"*/
router.get('/userslist', function (req, res, next) { //route de readAll 
  result = userModel.readall(function (result) {
    res.render('usersList', { title: 'List des utilisateurs', users: result });
    /*vue userList, le deuxième paramètre de render est un objet qui contient toutes les variables qui seront utilisées dans la vue. */
  });
});

module.exports = router;