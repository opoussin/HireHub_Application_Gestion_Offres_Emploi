const DB = require("../Modele/db.js");
const adminModele = require("../Modele/Administrateur.js");
const communModele = require("../Modele/Commun.js");
const recrutModele = require("../Modele/Recruteur.js");

describe("Model Tests", () => {
    beforeAll(() => {
        console.log("avant");
        jest.setTimeout(5000);
    });

    afterAll((done) => {
        function callback (err){
        if (err) done (err);
        else done();
        }
        DB.end(callback);
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
                expect(resultat[0].nom).toEqual("Test");
                //si tout ok on renvoie rien dans le done()
                done();
            } catch (err) {
                //si le test fail => on renvoit l'erreur dans le done(err);
                done.fail(err);
            }
        }
        adminModele.readUser("test@test", cbRead);
    });

    test("enable user", (done) => {
        function cbRead(resultat) {
            try {
                expect(resultat).toBeTruthy();
                done();
            } catch (err) {
                done(err);
            }
        }
        adminModele.enableUser("test@test", cbRead);
    });

    test("read enable user", (done) => {
        function cbRead(resultat) {
            const cle = Object.keys(resultat[0]);
            try {
                expect(cle.sort()).toEqual(
                    ["mail", "mdp", "nom", "prenom", "telephone", "dateCreation", "statut", "type"].sort()
                );
                expect(resultat[0].statut).toEqual(1);
                done();
            } catch (err) {
                done(err);
            }
        }
        adminModele.readUser("test@test", cbRead);
    });

    test("disable user", (done) => {
        function cbRead(resultat) {
            try {
                expect(resultat).toBeTruthy();
                done();
            } catch (err) {
                done(err);
            }
        }
        adminModele.disableUser("test@test", cbRead);
    });

    test("read disable user", (done) => {
        function cbRead(resultat) {
            const cle = Object.keys(resultat[0]);
            try {
                expect(cle.sort()).toEqual(
                    ["mail", "mdp", "nom", "prenom", "telephone", "dateCreation", "statut", "type"].sort()
                );
                expect(resultat[0].statut).toEqual(0);
                done();
            } catch (err) {
                done(err);
            }
        }
        adminModele.readUser("test@test", cbRead);
    });
    

    test("accept admin", (done) => {
        function cbRead(resultat) {
            const cle = Object.keys(resultat[0]);
            try {
                console.log("resultats", resultat);
                expect(cle.sort()).toEqual(
                    ["mail", "mdp", "nom", "prenom", "telephone", "dateCreation", "statut", "type"].sort()
                );
                expect(resultat[0].statut).toEqual(0);
                done();
            } catch (err) {
                done(err);
            }
        }
        adminModele.acceptAdmin("test@test", cbRead);
    });

    /*test("creat orga", (done) => {
        adminModele.creatOrga("Test","100","Association","Test", (resultat) => {
            try {
                expect(resultat).toBeTruthy();
                done();
            } catch (err) {
                done(err);
            }
        });
        
    });*/

    test("read create orga", (done) => {
        function cbRead(resultat) {
            const cle = Object.keys(resultat[0]);
            try {
                expect(cle.sort()).toEqual(
                    ["nom", "siren", "type", "siegeSocial"].sort()
                );
                expect(resultat[0].siren).toEqual(100);
                done();
            } catch (err) {
                done(err);
            }
        }
        adminModele.readOrgaSiren(100, cbRead);
    });

    /*test("delete orga", (done) => {
        function cbRead(resultat) {
            try {
                expect(resultat).toBeTruthy();
                done();
            } catch (err) {
                done(err);
            }
        }
        recrutModele.deleteOrga(100,cbRead);
    });

    test("read delete orga", (done) => {
        function cbRead(resultat) {
            
            try {
                expect(resultat).toEqual([]);
                done();
            } catch (err) {
                done(err);
            }
        }
        adminModele.readOrgaSiren(100, cbRead);
    });*/

    test("accept orga", (done) => {
        function cbRead(resultat) {
            const cle = Object.keys(resultat[0]);
            try {
                expect(cle.sort()).toEqual(
                    ["nom", "siren", "type", "siegeSocial", "recruteur", "statut", "date"].sort()
                );
                expect(resultat[0].statut).toEqual("Validé");
                done();
            } catch (err) {
                done(err);
            }
        }
        adminModele.acceptOrga("Test", "101", "Association","test@test", "1", "2023-06-13", cbRead);
    });

    

})