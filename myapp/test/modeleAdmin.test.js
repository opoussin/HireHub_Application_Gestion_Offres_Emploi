const DB = require("../Modele/db.js");
const adminModele = require("../Modele/Administrateur.js");
const communModele = require("../Modele/Commun.js");
const recrutModele = require("../Modele/Recruteur.js");

describe("Model Tests", () => {
    beforeAll(() => {
        console.log("avant");
        jest.setTimeout(5000);
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
                //les valeurs ok ?
                expect(resultat).toBeTruthy();
                //si tout ok on renvoie rien dans le done()
                done();
            } catch (err) {
                //si le test fail => on renvoit l'erreur dans le done(err);
                done.fail(err);
            }
        }
        adminModele.enableUser("test@test", cbRead);
    });

    test("read enable user", (done) => {
        function cbRead(resultat) {
            const cle = Object.keys(resultat[0]);
            try {
                //l'objet user est valide (niveau champs)
                expect(cle.sort()).toEqual(
                    ["mail", "mdp", "nom", "prenom", "telephone", "dateCreation", "statut", "type"].sort()
                );
                //les valeurs ok ?
                expect(resultat[0].statut).toEqual(1);
                //si tout ok on renvoie rien dans le done()
                done();
            } catch (err) {
                //si le test fail => on renvoit l'erreur dans le done(err);
                done.fail(err);
            }
        }
        adminModele.readUser("test@test", cbRead);
    });

    test("disable user", (done) => {
        function cbRead(resultat) {
            try {
                //les valeurs ok ?
                expect(resultat).toBeTruthy();
                //si tout ok on renvoie rien dans le done()
                done();
            } catch (err) {
                //si le test fail => on renvoit l'erreur dans le done(err);
                done.fail(err);
            }
        }
        adminModele.disableUser("test@test", cbRead);
    });

    test("read disable user", (done) => {
        function cbRead(resultat) {
            const cle = Object.keys(resultat[0]);
            try {
                //l'objet user est valide (niveau champs)
                expect(cle.sort()).toEqual(
                    ["mail", "mdp", "nom", "prenom", "telephone", "dateCreation", "statut", "type"].sort()
                );
                //les valeurs ok ?
                expect(resultat[0].statut).toEqual(0);
                //si tout ok on renvoie rien dans le done()
                done();
            } catch (err) {
                //si le test fail => on renvoit l'erreur dans le done(err);
                done.fail(err);
            }
        }
        adminModele.readUser("test@test", cbRead);
    });
    

    test("accept admin", (done) => {
        function cbRead(resultat) {
            const cle = Object.keys(resultat[0]);
            try {
                console.log("resultats", resultat);
                //l'objet user est valide (niveau champs)
                expect(cle.sort()).toEqual(
                    ["mail", "mdp", "nom", "prenom", "telephone", "dateCreation", "statut", "type"].sort()
                );
                //les valeurs ok ?
                expect(resultat[0].statut).toEqual(0);
                //si tout ok on renvoie rien dans le done()
                done();
            } catch (err) {
                //si le test fail => on renvoit l'erreur dans le done(err);
                done.fail(err);
            }
        }
        adminModele.acceptAdmin("test@test", 
            adminModele.readUser("test@test",cbRead) 
        );
    });

    test("creat orga", (done) => {
        function cbRead(resultat) {
            try {
                expect(resultat).toBeTruthy();
                //si tout ok on renvoie rien dans le done()
                done();
            } catch (err) {
                //si le test fail => on renvoit l'erreur dans le done(err);
                done.fail(err);
            }
        }
        adminModele.creatOrga("Test",100,"Association","Test", cbRead);
    });

    test("read create orga", (done) => {
        function cbRead(resultat) {
            const cle = Object.keys(resultat[0]);
            try {
                //l'objet user est valide (niveau champs)
                expect(cle.sort()).toEqual(
                    ["nom", "siren", "type", "siegeSocial"].sort()
                );
                //les valeurs ok ?
                expect(resultat[0].siren).toEqual(100);
                //si tout ok on renvoie rien dans le done()
                done();
            } catch (err) {
                //si le test fail => on renvoit l'erreur dans le done(err);
                done.fail(err);
            }
        }
        adminModele.readOrga(100, cbRead);
    });

    test("delete orga", (done) => {
        function cbRead(resultat) {
            try {
                //les valeurs ok ?
                expect(resultat).toEqual([]);
                //si tout ok on renvoie rien dans le done()
                done();
            } catch (err) {
                //si le test fail => on renvoit l'erreur dans le done(err);
                done.fail(err);
            }
        }
        recrutModele.deleteOrga("100",cbRead);
    });

    test("read delete orga", (done) => {
        function cbRead(resultat) {
            const cle = Object.keys(resultat[0]);
            try {
                //l'objet user est valide (niveau champs)
                expect(cle.sort()).toEqual(
                    ["nom", "siren", "type", "siegeSocial"].sort()
                );
                //les valeurs ok ?
                expect(resultat[0].siren).toEqual(100);
                //si tout ok on renvoie rien dans le done()
                done();
            } catch (err) {
                //si le test fail => on renvoit l'erreur dans le done(err);
                done.fail(err);
            }
        }
        adminModele.readOrga(100, cbRead);
    });

})