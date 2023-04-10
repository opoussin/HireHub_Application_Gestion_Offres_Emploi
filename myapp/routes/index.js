var express = require('express');
var router = express.Router();
var userModel = require('../Modele/Utilisateur.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/connexion', function (req, res, next) { 
  result=userModel.read(function(result){
    res.render('connexion',{ users: result}); 
  });
});

router.post('/inscription', function (req, res, next) { 
  result=userModel.creat(function(result){
    res.render('inscription',{ users: result}); 
  });
});

module.exports = router;
