const request = require("supertest");
const app = require("../app");


describe("Test the root path", () => {
    beforeAll(() => {
        console.log("avant");
        jest.setTimeout(5000);

        
    });
    
    
    test("route connexion", done => {
        request(app)
            .get("/connexion")
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });

    test("post connexion",done => {
     request(app)
        .post("/connexion")
        .send({
            mail: "amdin@admin",
            mdp: "Connexion123#"
        }).expect(200);
    });

    test("route administrateur", done => {
        request(app)
            .get("/admin/administrateur")
            .query({
                mail: "emilie@gommard",
                nom: "gommard",
                prenom: "emilie",
                date: "2023-06-01",
                statut: "1",
                type: "3"
              })
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });
    test("route administrateur activer", done => {
        request(app)
            .get("/admin/administrateur/activer")
            .query({
                mail: "emilie@gommard"
              })
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });
    test("route administrateur desactiver", done => {
        request(app)
            .get("/admin/administrateur/desactiver")
            .query({
                mail: "emilie@gommard"
              })
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });
    test("route administrateur supprimer", done => {
        request(app)
            .get("/admin/administrateur/supprimer")
            .query({
                mail: "hafsa@bouzid.com"
              })
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
    }); 
    test("route demandes", done => {
        request(app)
            .get("/admin/demandes")
            .query({
                mail: "emilie@gommard",
                date: "2023-06-01"
              })
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });
    test("route demandes admin accept", done => {
        request(app)
            .get("/admin/demandes_admin/accept")
            .query({
                user : "emilie@gommard" 
              })
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });
    test("route demandes admin deny", done => {
        request(app)
            .get("/admin/demandes_admin/deny")
            .query({
                user : "emilie@gommard" 
              })
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });
    test("route demandes orga accept", done => {
        request(app)
            .get("/admin/demandes_orga/accept")
            .query({
                siren : "100000000",
                nom : "Test",
                type : "Test",
                siege :"Test", 
                user :"admin@admin"
              })
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });
    test("route demandes orga deny", done => {
        request(app)
            .get("/admin/demandes_orga/deny")
            .query({
                siren : "100000000", 
                user :"admin@admin"
              })
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });
    test("route profil admin", done => {
        request(app)
            .get("/admin/profil_admin")
              
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });
});