const DB= require ("../Modele/db.js");
const model= require ("../Modele/user.js");
describe("Model Tests", () => {
    test ("read user",(done)=>{
        model.read("test@test.fr", function (resultat){
        nom = resultat[0].nom;
        expect(nom).toBe("test");
        })
    function callback (err){
    if (err) done (err);
    else done();
    }
    DB.end(callback); 
    }
    );
})
