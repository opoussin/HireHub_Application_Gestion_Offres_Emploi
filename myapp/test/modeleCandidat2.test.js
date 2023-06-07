const DB = require('../Modele/db.js');
const modelCandidat = require("../Modele/Candidat.js");

jest.mock('../Modele/db.js', () => ({
  query: jest.fn((sql, params, callback) => {
    // Simuler une réponse réussie
    callback(null, params);
  })
}));

describe("Model Candidat Tests", () => {
  test("candidat : readUserDmdOrga", () => {
    const mockUserData = [{
      nom: "ok",
      siren: "3",
      type: "association",
      siegeSocial: "siege",
      recruteur: "chloe@go",
      statut: "Refusé",
      date: "2023-05-09"
    }];

    // Configure le comportement du mock pour DB.query
    DB.query.mockImplementation((query, params, callback) => {
      // Simule le callback avec les fausses données utilisateur
      callback(null, mockUserData);
    });

    modelCandidat.readUserDmdOrga('chloe@go', (results) => {
      // Assertions sur les résultats
      expect(results).toEqual(mockUserData);
    });

    expect(DB.query).toHaveBeenCalledWith(
      'select * from DMD_ORGA where recruteur=?',
      'chloe@go',
      expect.any(Function)
    );
  });

  test("candidat : readUserDmdOrga", () => {
    const mockUserData = [{
      nom: "ComEd",
      siren: "3",
      type: "association",
      siegeSocial: "siege",
      recruteur: "chloe@go",
      statut: "Refusée",
      date: "2023-05-09"
    }];

    // Configure le comportement du mock pour DB.query
    DB.query.mockImplementation((query, params, callback) => {
      // Simule le callback avec les fausses données utilisateur
      callback(null, mockUserData);
    });

    modelCandidat.readUserDmdOrga("chlo@go", (result) => {
      // Assertions sur les résultats
      expect(result).not.toEqual([]);
    });

    expect(DB.query).toHaveBeenCalledWith(
      'select * from DMD_ORGA where recruteur=?',
      'chlo@go',
      expect.any(Function)
    );
  });
});