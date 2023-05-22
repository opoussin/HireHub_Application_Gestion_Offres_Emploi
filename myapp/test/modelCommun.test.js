/*COMMUN
areUserValid
creatUser
areRecruteur
areAdmin
readOrga
deleteUser
readUser
readOrgaUser
*/
/*
const DB= require ("../Modele/db.js");
const model= require ("../Modele/Commun.js");
describe("Model Tests", () => {
    test ("read user",(done)=>{
        model.readUser("chloe@go", function (resultat){
        nom = resultat[0].nom;
        expect(nom).toBe("Gommard");
        })
    function callback (err){
    if (err) done (err);
    else done();
    }
    DB.end(callback); 
    }
    );
})
*/
const model = require("../Modele/Commun.js");
// Import des dépendances pour les tests
const assert = require('assert');
const sinon = require('sinon');

// Initialisation des variables de test
const mail = 'test@example.com';
const nom = 'John';
const prenom = 'Doe';
const telephone = '1234567890';
const callback = sinon.stub();


describe("Model Tests", () => {
  // ...

  test("updateUser", (done) => {
    model.updateUser("example@mail.com", "John", "Doe", "123456789", function (err, result) {
      expect(err).toBeFalsy(); // Vérifie si aucune erreur n'est survenue
      expect(result).toBeDefined(); // Vérifie si le résultat est défini
      done();
    });
  });

  test("updateUserMdp", (done) => {
    model.updateUserMdp("newpassword", "example@mail.com", function (err) {
      expect(err).toBeFalsy(); // Vérifie si aucune erreur n'est survenue
      done();
    });
  });

  test("readAllOffreValide", (done) => {
    model.readAllOffreValide(function (results) {
      expect(results).toBeDefined(); // Vérifie si le résultat est défini
      expect(Array.isArray(results)).toBe(true); // Vérifie si le résultat est un tableau
      done();
    });
  });

  test("readOffreFiltre", (done) => {
    model.readOffreFiltre("exampleOrga", "Paris", "CDI", "50000", "Temps plein", "Titre", function (results) {
      expect(results).toBeDefined(); // Vérifie si le résultat est défini
      expect(Array.isArray(results)).toBe(true); // Vérifie si le résultat est un tableau
      done();
    });
  });

  test("creatDmdOrga", (done) => {
    model.creatDmdOrga("Nom Orga", "123456789", "Type Orga", "Siège Social", "example@mail.com", function (results) {
      expect(results).toBeDefined(); // Vérifie si le résultat est défini
      done();
    });
  });
  

  // ...

  // Ajoutez les autres tests pour les autres fonctions du module
  
});
