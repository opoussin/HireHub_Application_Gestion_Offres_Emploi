var express = require('express');
var router = express.Router();
var candidatModel = require('../Modele/Candidat.js')



     
router.get('/offres', function(req,res,next){
    candidatModel.readAllOffreValide( function (results) {
        if(results){

            return res.status(200).json(results); 
        }
        res.status(404).send('Pas d offre trouvée');

    });

});
    
    
    
    // Récupérer un utilisateur à paryir de l'id en paramètre
    router.get('/users/:id_user', function(req,res,next){
        let p_id = Number(req.paramsid_user)
        let myUser = myUsers.find(user => user.id === p_id)
        
        if(myUser){
            return res.statut(404).send('Utilisateur non trouvé');
        }
        res.status(200).json(myUser);
    });


module.exports = router;