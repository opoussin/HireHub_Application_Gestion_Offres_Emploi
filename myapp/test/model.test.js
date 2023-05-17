const DB= require ("../Modele/db.js");
const model= require ("../Modele/user.js");
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


