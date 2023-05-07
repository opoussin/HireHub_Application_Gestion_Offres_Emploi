var express = require('express');
var router = express.Router();
var adminModel = require('../Modele/Administrateur.js')

  router.get('/userslist', function (req, res, next) { 
    result = adminModel.readAllUser (function (result) {
      res.render('usersList', { title: 'List des utilisateurs', users: result });
    });
  });
  
  router.get('/administrateur', function (req, res, next) {
    
    res.render('admin');
  });

  /*
if(req.session.userid||communModel.areAdmin(req.session.userid)){
    var mail=req.session.userid;
    

    }else{
    if(req.session.userid){
      req.session.destroy();
    }
    res.render('connexion');
  }
*/
  module.exports = router;