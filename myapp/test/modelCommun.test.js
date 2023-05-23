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
const DB = require("../Modele/db.js");

// Import des dépendances pour les tests
const assert = require('assert');
const sinon = require('sinon');

// Initialisation des variables de test
const mail = 'test@example.com';
const nom = 'John';
const prenom = 'Doe';
const telephone = '1234567890';
const callback = sinon.stub();
const mdp = 123;
const orga = "exemple";
/*
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
describe("Model Tests", () => {
  afterAll((done) => {
    function callback(err) {
      if (err) done(err);
      else done();
    }
    DB.end(callback);
  });
    test("creatUser", (done) => {
        model.creatUser(mail, nom, prenom, mdp, telephone, function (err) {
        expect(err).toBeFalsy(); // Vérifie si aucune erreur n'est survenue
        done();
        });
    });
    /* pas utilisée je crois
  test("areUserValid", (done) => {
    model.areUserValid("example@mail.com", "password", function (result) {
      expect(result).toBeDefined(); // Vérifie si le résultat est défini (utilisateur valide)
      done();
    });
  });*/


  test("areRecruteur", (done) => {
    model.areRecruteur(mail, function (result) {
      expect(result).toBe(false); // Vérifie si le résultat est faux (non recruteur)
      done();
    });
  });

  test("areAdmin", (done) => {
    model.areAdmin(mail, function (result) {
      expect(result).toBe(false); // Vérifie si le résultat est faux (non administrateur)
      done();
    });
  });

  test("readOrga", (done) => {
    model.readOrga("exampleOrga", function (results) {
      expect(results).toHaveLength(0); // Vérifie si aucun résultat n'est retourné (0 élément)
      done();
    });
  });



  test("readUser", (done) => {
    model.readUser("chloe@go", function (result) {
      expect(result).toBeDefined(); // Vérifie si le résultat est défini (utilisateur trouvé)
      done();
    });
  });

  test("readOrgaUser", (done) => {
    model.readOrgaUser("chloe@go", function (results) {
      expect(results).toHaveLength(1); // Vérifie si aucun résultat n'est retourné (0 élément)
      done();
    });
    model.readOrgaUser("ddd@ooo", function (results) {
        expect(results).toHaveLength(0); // Vérifie si aucun résultat n'est retourné (0 élément)
        done();
      });
  });
  
  test("deleteUser", (done) => {
    model.deleteUser(mail, function () {
      // Vérifie si la suppression de l'utilisateur s'est déroulée avec succès
      expect(err).toBeFalsy();
      done();
    });
  });
});
