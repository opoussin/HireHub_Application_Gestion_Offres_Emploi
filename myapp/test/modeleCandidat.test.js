/*
updateUser
updateUserMdp
readAllOffreValide
readOffreFiltre
creatDmdOrga
creatDmdRecruteur
creatDmdAdmin
creatCandidature
deleteCandidature
updateCandidature
readAllCandidature
deleteDmdOrga
deleteDmdRecruteur
deleteDmdRecruteurOrga
deleteDmdAdmin
readUserDmdOrga
readUserDmdRecruteur
readUserDmdAdmin
*/
/*

const DB= require ("../Modele/db.js");
const model= require ("../Modele/Commun.js");
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
*/

const DB = require("../Modele/db.js");
const model = require("../Modele/Candidat.js");

describe('Model Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('updateUser updates user information', () => {
    const mail = 'test@example.com';
    const nom = 'John';
    const prenom = 'Doe';
    const telephone = '1234567890';
    const callback = jest.fn();

    const mockDbQuery = jest.spyOn(DB, 'query').mockImplementation((sql, params, callback) => {
      // Verify if the SQL query is correct
      expect(sql).toBe('UPDATE UTILISATEUR SET nom =?, prenom=?, telephone=? WHERE mail=?');
      // Verify if the parameters are correct
      expect(params).toEqual([nom, prenom, telephone, mail]);

      // Call the callback without an error
      callback(/* error */);
    });

    model.updateUser(mail, nom, prenom, telephone, callback);

    // Verify if the function DB.query was called with the correct parameters
    expect(mockDbQuery).toHaveBeenCalledWith(expect.any(String), expect.any(Array), expect.any(Function));

    // Verify if the callback was called without an error
    expect(callback).toHaveBeenCalledWith(/* error */);

    // Restore the original DB.query function
    mockDbQuery.mockRestore();
  });

  test('updateUserMdp updates user password', () => {
    const mdp1 = 'newpassword';
    const mail = 'test@example.com';
    const callback = jest.fn();

    const mockDbQuery = jest.spyOn(DB, 'query').mockImplementation((sql, params, callback) => {
      // Verify if the SQL query is correct
      expect(sql).toBe('UPDATE UTILISATEUR SET mdp =? WHERE mail=?');
      // Verify if the parameters are correct
      expect(params).toEqual([mdp1, mail]);

      // Call the callback without an error
      callback(/* error */);
    });

    model.updateUserMdp(mdp1, mail, callback);

    // Verify if the function DB.query was called with the correct parameters
    expect(mockDbQuery).toHaveBeenCalledWith(expect.any(String), expect.any(Array), expect.any(Function));

    // Verify if the callback was called without an error
    expect(callback).toHaveBeenCalledWith(/* error */);

    // Restore the original DB.query function
    mockDbQuery.mockRestore();
  });

  test('readAllOffreValide retrieves all valid offers', () => {
    const callback = jest.fn();

    const mockDbQuery = jest.spyOn(DB, 'query').mockImplementation((sql, callback) => {
      // Verify if the SQL query is correct
      expect(sql).toBe("SELECT * FROM OFFRE INNER JOIN FICHE_POSTE ON OFFRE.numero = FICHE_POSTE.offre INNER JOIN ORGANISATION ON ORGANISATION.siren=OFFRE.organisation WHERE OFFRE.etat='publiee'");

      // Call the callback with a fake result
      callback(null, /* fake result */);
    });

    model.readAllOffreValide(callback);

    // Verify if the function DB.query was called with the correct parameters
    expect(mockDbQuery).toHaveBeenCalledWith(expect.any(String), expect.any(Function));

    // Verify if the callback was called with the fake result
    expect(callback).toHaveBeenCalledWith(/* fake result */);

    // Restore the original DB.query function
    mockDbQuery.mockRestore();
  });

  test('readOffreFiltre retrieves filtered offers', () => {
    const organisation = 'Example Org';
    const lieu = 'Paris';
    const statut = 'Full-time';
    const salaire = '50000';
    const type = 'Software Engineer';
    const intitule = 'Job Title';
    const callback = jest.fn();

    const mockDbQuery = jest.spyOn(DB, 'query').mockImplementation((sql, callback) => {
      // Verify if the SQL query is correct
      expect(sql).toContain("SELECT * FROM OFFRE INNER JOIN FICHE_POSTE ON OFFRE.numero = FICHE_POSTE.offre INNER JOIN ORGANISATION ON ORGANISATION.siren=OFFRE.organisation WHERE OFFRE.etat='publiee'");
      expect(sql).toContain(`AND FICHE_POSTE.intitule = '${intitule}'`);
      expect(sql).toContain(`AND ORGANISATION.nom = '${organisation}'`);
      expect(sql).toContain(`AND FICHE_POSTE.lieu = '${lieu}'`);
      expect(sql).toContain(`AND FICHE_POSTE.statut = '${statut}'`);
      expect(sql).toContain(`AND FICHE_POSTE.type > ${salaire}`);
      expect(sql).toContain(`AND FICHE_POSTE.type = '${type}'`);

      // Call the callback with a fake result
      callback(null, /* fake result */);
    });

    model.readOffreFiltre(organisation, lieu, statut, salaire, type, intitule, callback);

    // Verify if the function DB.query was called with the correct parameters
    expect(mockDbQuery).toHaveBeenCalledWith(expect.any(String), expect.any(Function));

    // Verify if the callback was called with the fake result
    expect(callback).toHaveBeenCalledWith(/* fake result */);

    // Restore the original DB.query function
    mockDbQuery.mockRestore();
  });

  test('creatDmdOrga creates a new organization request', () => {
    const nom = 'New Org';
    const siren = '123456789';
    const type = 'Public';
    const siegeSocial = 'Paris';
    const mail = 'test@example.com';
    const callback = jest.fn();

    const mockDbQuery = jest.spyOn(DB, 'query').mockImplementation((sql, params, callback) => {
      if (sql.startsWith('SELECT')) {
        // Simulate an existing organization
        callback(null, /* fake result */);
      } else {
        // Verify if the SQL query is correct
        expect(sql).toBe("INSERT INTO DMD_ORGA (nom, siren, type, siegeSocial, recruteur) VALUES (?,?,?,?,?)");
        // Verify if the parameters are correct
        expect(params).toEqual([nom, siren, type, siegeSocial, mail]);

        // Call the callback with a fake result
        callback(null, /* fake result */);
      }
    });

    model.creatDmdOrga(nom, siren, type, siegeSocial, mail, callback);

    // Verify if the function DB.query was called with the correct parameters
    expect(mockDbQuery).toHaveBeenCalledWith(expect.any(String), expect.any(Array), expect.any(Function));

    // Verify if the callback was called with the fake result
    expect(callback).toHaveBeenCalledWith(/* fake result */);

    // Restore the original DB.query function
    mockDbQuery.mockRestore();
  });
  
  test("updateUser", (done) => {
    model.updateUser("chloe@go", "Gommard", "Chloe", "123456789", (result) => {
      expect(result).toBe(/* expected result */);
      done();
    });
  });

  test("updateUserMdp", (done) => {
    model.updateUserMdp("newPassword", "chloe@go", () => {
      // Check if the update was successful
      // ...
      done();
    });
  });

  test("readAllOffreValide", (done) => {
    model.readAllOffreValide((results) => {
      expect(results).toEqual(/* expected results */);
      done();
    });
  });

  test("readOffreFiltre", (done) => {
    model.readOffreFiltre("Orga", "Lieu", "Statut", "Salaire", "Type", "Intitule", (results) => {
      expect(results).toEqual(/* expected results */);
      done();
    });
  });

  test("creatDmdOrga", (done) => {
    model.creatDmdOrga("Nom", "123456789", "Type", "SiegeSocial", "mail@example.com", (results) => {
      expect(results).toBe(/* expected result */);
      done();
    });
  });
});
