var express = require('express');
var router = express.Router();
var userModel = require('../Modele/user.js')
e ("/")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/Connexion', function (req, res, next) { 
  result=userModel.read(function(result){
    res.render('Connexion', { mail: result }); 
  });
});

module.exports = router;
