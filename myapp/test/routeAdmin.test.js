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

    test("post connexion", done => {
        request(app)
        .post("/send")
        .expect("Content-Type", /json/)
        .send({
            mail: "test@tes",
            mdp: "123"
        })
        .expect(201)
        .end((err, response) => {
            // Vérifiez les assertions sur la réponse...
            done(); // Indique que le test est terminé
        });
        done();
    });
    


    /*it("should respond with status 200 and render the 'admin' view", async () => {
        const response = await request(app)
        .get("/admin/administrateur")
        .query({
            mail: "test@test2",
            nom: "test",
            prenom: "test",
            date: "2023-06-14",
            statut: "1",
            type: "3"
        });

        expect(response.status).toBe(200);
        expect(response.text).toContain("admin"); // Assurez-vous que le rendu de la vue contient le mot-clé "admin"
        // Vous pouvez ajouter d'autres assertions pour vérifier d'autres comportements attendus
    });

    it("should redirect to '/admin/demandes' when no results are found", async () => {
        const response = await request(app).get("/admin/administrateur");

        expect(response.status).toBe(302); // Assurez-vous que la réponse a le statut de redirection (302)
        expect(response.header.location).toBe("/admin/demandes"); // Assurez-vous que la redirection est effectuée vers '/admin/demandes'
        // Vous pouvez ajouter d'autres assertions pour vérifier d'autres comportements attendus
    });*/

});