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

    test("read all user", (done) => {
        function cbRead(resultat) {
            const cle = Object.keys(resultat[0]);
            try {
                //l'objet user est valide (niveau champs)
                expect(cle.sort()).toEqual(
                    ["mail", "mdp", "nom", "prenom", "telephone", "dateCreation", "statut", "type"].sort()
                );
                done();
            } catch (err) {
                //si le test fail => on renvoit l'erreur dans le done(err);
                done.fail(err);
            }
        }
        adminModele.readAllUser(cbRead);
    });

    test("enable user true", (done) => {
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

    test("enable user false", (done) => {
        function cbRead(resultat) {
            try {
                expect(resultat).toBeFalsy();
                done();
            } catch (err) {
                done(err);
            }
        }
        adminModele.enableUser("test@testz", cbRead);
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

    test("disable user true", (done) => {
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

    test("disable user false", (done) => {
        function cbRead(resultat) {
            try {
                expect(resultat).toBeFalsy();
                done();
            } catch (err) {
                done(err);
            }
        }
        adminModele.disableUser("test@testz", cbRead);
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
    

    test("accept admin true", (done) => {
        function cbRead(resultat) {
            try {
                expect(resultat).toBeTruthy();
                done();
            } catch (err) {
                done(err);
            }
        }
        adminModele.acceptAdmin("test@test", cbRead);
    });
    test("accept admin false", (done) => {
        function cbRead(resultat) {
            try {
                expect(resultat).toBeFalsy();
                done();
            } catch (err) {
                done(err);
            }
        }
        adminModele.acceptAdmin("test@testz", cbRead);
    });

    test("creat orga true", (done) => {
        adminModele.creatOrga("Test","100","Association","Test", (resultat) => {
            try {
                expect(resultat).toBeTruthy();
                done();
            } catch (err) {
                done(err);
            }
        });
        
    });

    test("creat orga false", (done) => {
        adminModele.creatOrga("Test","1","Association","Test", (resultat) => {
            try {
                expect(resultat).toBeFalsy();
                done();
            } catch (err) {
                done(err);
            }
        });
        
    });

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

    test("accept recruteur true", (done) => {
        function cbRead(resultat) {
            try {
                expect(resultat).toBeTruthy();
                done();
            } catch (err) {
                done(err);
            }
        }
        adminModele.acceptRecruteur("test@test", "100", cbRead);
    });

    test("accept recruteur false", (done) => {
        function cbRead(resultat) {
            try {
                expect(resultat).toBeFalsy();
                done();
            } catch (err) {
                done(err);
            }
        }
        adminModele.acceptRecruteur("test@testz", "100", cbRead);
    });

    test("read dmd orga", (done) => {
        function cbRead(resultat) {
            try {
                if(resultat.length >0){
                    const cle = Object.keys(resultat[0]);
                    //l'objet user est valide (niveau champs)
                    expect(cle.sort()).toEqual(
                        ["nom", "siren", "type", "siegeSocial", "recruteur", "statut", "date"].sort()
                    );
                }else{
                    expect(resultat).toStrictEqual([]);
                }
                done();
            } catch (err) {
                //si le test fail => on renvoit l'erreur dans le done(err);
                done(err);
            }
        }
        adminModele.readDmdOrga("En attente", undefined, undefined, cbRead);
    });

    test("read dmd admin", (done) => {
        function cbRead(resultat) {
            try {
                if(resultat.length >0){
                    const cle = Object.keys(resultat[0]);
                    expect(cle.sort()).toEqual(
                        ["utilisateur", "statut", "date"].sort()
                    );
                }else{
                    expect(resultat).toStrictEqual([]);
                }
                done();
            } catch (err) {
                //si le test fail => on renvoit l'erreur dans le done(err);
                done(err);
            }
        }
        adminModele.readDmdAdmin("En attente", undefined, undefined, cbRead);
    });

    test("read all dmd admin", (done) => {
        function cbRead(resultat) {
            const cle = Object.keys(resultat[0]);
            try {
                if(resultat.length >0){
                    const cle = Object.keys(resultat[0]);
                    expect(cle.sort()).toEqual(
                        ["utilisateur", "statut", "date"].sort()
                    );
                }else{
                    expect(resultat).toStrictEqual([]);
                }
                done();
            } catch (err) {
                //si le test fail => on renvoit l'erreur dans le done(err);
                done(err);
            }
        }
        adminModele.readAllDmdAdmin(undefined, undefined, cbRead);
    });

    test("read all dmd orga", (done) => {
        function cbRead(resultat) {
            try {
                //l'objet user est valide (niveau champs)
                if(resultat.length >0){
                    const cle = Object.keys(resultat[0]);
                    expect(cle.sort()).toEqual(
                        ["nom", "siren", "type", "siegeSocial", "recruteur", "statut", "date"].sort()
                    );
                }else{
                    expect(resultat).toStrictEqual([]);
                }
                done();
            } catch (err) {
                //si le test fail => on renvoit l'erreur dans le done(err);
                done(err);
            }
        }
        adminModele.readAllDmdOrga( undefined, undefined, cbRead);
    });

    test("read user filtre", (done) => {
        function cbRead(resultat) {
            try {
                //l'objet user est valide (niveau champs)
                if(resultat.length >0){
                    const cle = Object.keys(resultat[0]);
                    expect(cle.sort()).toEqual(
                        ["mail", "mdp", "nom", "prenom", "telephone", "dateCreation", "statut", "type"].sort()
                    );
                }else{
                    expect(resultat).toStrictEqual([]);
                }
                done();
            } catch (err) {
                //si le test fail => on renvoit l'erreur dans le done(err);
                done(err);
            }
        }
        adminModele.readUserFiltre( undefined, undefined,undefined,undefined,undefined,undefined, cbRead);
    });

    test("update dmd admin valider", (done) => {
        function cbRead(resultat) {
            try {
                //l'objet user est valide (niveau champs)
               
                expect(resultat).toBeTruthy();
                done();
            } catch (err) {
                //si le test fail => on renvoit l'erreur dans le done(err);
                done(err);
            }
        }
        adminModele.updateDmdAdmin("test@test2", true, cbRead);
    });

    test("update dmd admin refuser", (done) => {
        function cbRead(resultat) {
            try {
                //l'objet user est valide (niveau champs)
               
                expect(resultat).toBeTruthy();
                done();
            } catch (err) {
                //si le test fail => on renvoit l'erreur dans le done(err);
                done(err);
            }
        }
        adminModele.updateDmdAdmin("test@test2", false, cbRead);
    });

    test("update dmd orga valider", (done) => {
        function cbRead(resultat) {
            try {
                //l'objet user est valide (niveau champs)
               
                expect(resultat).toBeTruthy();
                done();
            } catch (err) {
                //si le test fail => on renvoit l'erreur dans le done(err);
                done(err);
            }
        }
        adminModele.updateDmdOrga("100","test@test", true, cbRead);
    });

    test("update dmd orga refuser", (done) => {
        function cbRead(resultat) {
            try {
                //l'objet user est valide (niveau champs)
               
                expect(resultat).toBeTruthy();
                done();
            } catch (err) {
                //si le test fail => on renvoit l'erreur dans le done(err);
                done(err);
            }
        }
        adminModele.updateDmdOrga("100", "test@test", false, cbRead);
    });

    test("update dmd recruteur valider", (done) => {
        function cbRead(resultat) {
            try {
                //l'objet user est valide (niveau champs)
               
                expect(resultat).toBeTruthy();
                done();
            } catch (err) {
                //si le test fail => on renvoit l'erreur dans le done(err);
                done(err);
            }
        }
        adminModele.updateDmdRecruteur("1","test@test2", true, cbRead);
    });

    test("update dmd recruteur refuser", (done) => {
        function cbRead(resultat) {
            try {
                //l'objet user est valide (niveau champs)
               
                expect(resultat).toBeTruthy();
                done();
            } catch (err) {
                //si le test fail => on renvoit l'erreur dans le done(err);
                done(err);
            }
        }
        adminModele.updateDmdRecruteur("1", "test@test2", false, cbRead);
    });

    test("delete orga", (done) => {
        recrutModele.deleteOrga("100", (resultat) => {
            try {
                expect(resultat).toBeTruthy();
                done();
            } catch (err) {
                done(err);
            }
        });
        
    });

})