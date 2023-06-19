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
    

});