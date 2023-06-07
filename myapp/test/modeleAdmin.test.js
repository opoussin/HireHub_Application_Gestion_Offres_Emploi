const DB= require ("../Modele/db.js");
const adminModele= require ("../Modele/Administrateur.js");

describe("Model Tests", () => {
    beforeAll(() => {
        console.log("avant");
    // des instructions à exécuter avant le lancement des tests
    });

    afterAll((done) => {
        function callback (err){
        if (err) done (err);
        else done();
    }
    DB.end(callback);
    });

    test ("read user",()=>{
    nom=null;
    function cbRead(resultat){
        nom = resultat[0].nom;
        expect(resultat).toBe(
        [
            {"mail":"oceane@etu",
            "mdp":"123",
            "nom":"Poussin",
            "prenom":"Océane",
            "telephone":"1234",
            "dateCreation":"2023-04-10 22:09:41",
            "statut":"1",
            "type":"3"}
        ]
        );
    }
    adminModele.readUser("oceane@etu", cbRead);
    });

    test ("read mauvais user",()=>{
        nom=null;
        function cbRead(resultat){
            expect(resultat).toBe([]);
        }
        adminModele.readUser("e@z", cbRead);
        });
})