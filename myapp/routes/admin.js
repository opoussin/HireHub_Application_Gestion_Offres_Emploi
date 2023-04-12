var express = require('express');
var router = express.Router();
var adminModel = require('../Modele/Administrateur.js')

  router.get('/userslist', function (req, res, next) { 
    result = adminModel.readAllUser (function (result) {
      res.render('usersList', { title: 'List des utilisateurs', users: result });
    });
  });

  module.exports = router;