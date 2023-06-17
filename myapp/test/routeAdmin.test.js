const request = require("supertest");
const app = require("../app");


describe("Test the root path", () => {
    test("administrateur", done => {
        request(app)
            .get("/admin/administrateur")
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });
    test("administrateur activer", done => {
        request(app)
            .get("/admin/administrateur/activer")
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });
    test("administrateur desactiver", done => {
        request(app)
            .get("/admin/administrateur/desactiver")
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });
    test("administrateur supprimer", done => {
        request(app)
            .get("/admin/administrateur/supprimer")
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });

});