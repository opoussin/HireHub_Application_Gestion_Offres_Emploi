const DB = require("../Modele/db.js");
const adminModele = require("../Modele/Administrateur.js");

describe("Model Tests", () => {
    beforeAll(() => {
        console.log("avant");
        // des instructions à exécuter avant le lancement des tests
    });

    test("read user", (done) => {
        function cbRead(resultat) {
            const cle = Object.keys(resultat[0]);
            try {
                //l'objet user est valide (niveau champs)
                expect(cle.sort()).toEqual(
                    ["mail", "mdp", "nom", "prenom", "telephone", "dateCreation", "statut", "type"].sort()
                );
                //les valeurs ok ?
                expect(resultat[0].nom).toSrictEqual("Poussin");
                //si tout ok on renvoie rien dans le done()
                done();
            } catch (err) {
                //si le test fail => on renvoit l'erreur dans le done(err);
                done(err);
            }
        }
        adminModele.readUser("oceane@etu", cbRead);
    });

    test("disable user", (done) => {
        function cbRead(resultat) {
            const cle = Object.keys(resultat[0]);
            try {
                //l'objet user est valide (niveau champs)
                expect(cle.sort()).toEqual(
                    ["mail", "mdp", "nom", "prenom", "telephone", "dateCreation", "statut", "type"].sort()
                );
                //les valeurs ok ?
                expect(resultat[0].statut).toSrictEqual(0);
                //si tout ok on renvoie rien dans le done()
                done();
            } catch (err) {
                //si le test fail => on renvoit l'erreur dans le done(err);
                done(err);
            }
        }
        adminModele.disableUser("oceane@etu", 
            adminModele.readUser("oceane@etu",cbRead) 
        );
    });

})