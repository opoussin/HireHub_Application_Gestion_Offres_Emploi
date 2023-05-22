/*
updateUser
updateUserMdp
readAllOffreValide
readOffreFiltre
creatDmdOrga
creatDmdRecruteur
creatDmdAdmin
creatCandidature
deleteCandidature
updateCandidature
readAllCandidature
deleteDmdOrga
deleteDmdRecruteur
deleteDmdRecruteurOrga
deleteDmdAdmin
readUserDmdOrga
readUserDmdRecruteur
readUserDmdAdmin
*/
/*

const DB= require ("../Modele/db.js");
const model= require ("../Modele/Commun.js");
describe("Model Tests", () => {
    test ("read user",(done)=>{
        model.read("chloe@go", function (resultat){
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

const DB = require("../Modele/db.js");
const model = require("../Modele/Commun.js");

describe("Model Tests", () => {
  afterAll((done) => {
    function callback(err) {
      if (err) done(err);
      else done();
    }
    DB.end(callback);
  });
    test("creatUser", (done) => {
        model.creatUser("example@mail.com", "John", "Doe", "password", "123456789", function (err) {
        expect(err).toBeFalsy(); // Vérifie si aucune erreur n'est survenue
        done();
        });
    });

  test("areUserValid", (done) => {
    model.areUserValid("example@mail.com", "password", function (result) {
      expect(result).toBeDefined(); // Vérifie si le résultat est défini (utilisateur valide)
      done();
    });
  });


  test("areRecruteur", (done) => {
    model.areRecruteur("example@mail.com", function (result) {
      expect(result).toBe(false); // Vérifie si le résultat est faux (non recruteur)
      done();
    });
  });

  test("areAdmin", (done) => {
    model.areAdmin("example@mail.com", function (result) {
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
    model.deleteUser("example@mail.com", function () {
      // Vérifie si la suppression de l'utilisateur s'est déroulée avec succès
      done();
    });
  });
});
