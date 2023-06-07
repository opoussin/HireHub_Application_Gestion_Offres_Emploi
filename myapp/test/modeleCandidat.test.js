/*
readUserDmdOrga
readUserDmdRecruteur
readUserDmdAdmin
readAllCandidature
readAllOffreValide
readOffreFiltre
updateUser
updateUserMdp
updateCandidature
creatDmdOrga
creatDmdRecruteur
creatDmdAdmin
creatCandidature
deleteCandidature
deleteDmdOrga
deleteDmdRecruteur
deleteDmdRecruteurOrga
deleteDmdAdmin

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

const DB = require('../Modele/db.js');
const modelCandidat = require("../Modele/Candidat.js");
/*
jest.mock(DB, () => ({
  query: jest.fn(),
}));
*/
jest.mock('../Modele/db.js', () => ({
  query: jest.fn((sql, callback) => {
    // Simuler une réponse réussie
    callback(null);
  })
}));
describe("Model Candidat Tests", () => {
  /*afterAll((done) => {
    function callback(err) {
      if (err) done(err);
      else done();
    }
    DB.end(callback);
  });*/
  //template
  /*test ("candidat : read", ()=>{
    const mockUserData = [{ id: 29, mail: 'test@test.test', pwd : 'test', prenom:'test', nom: 'test', tel: '0123456789', est_recruteur: 'non', organisation: null, est_admin: 'non', date_creation: '2023-05-17 10:59:24', statut: 'actif' }]; // Mock data to be returned by the query

    // Configure the mock behavior for db.query
    DB.query.mockImplementation((query, id, callback) => {
    // Simulate the callback with the mock user data
    callback(null, mockUserData);
    });

    modelCandidat.read(29, (results) => {
        // Assertions on the results
        expect(results).toEqual(mockUserData);
      });


    expect(DB.query).toHaveBeenCalledWith(
    'select * from Utilisateur where id = ?',
    29,
    expect.any(Function));
  });*/

// readUserDmdOrga
//    readUserDmdOrga: function (mail, callback) {
//         db.query("select * from DMD_ORGA where recruteur=?", mail, function
//             (err, results) {
//             if (err) throw err;
//             callback(results);
//         });
//     },
test ("candidat : readUserDmdOrga", ()=>{
  const mockUserData = [{nom:"ComEd",siren:"3",type:"association",siegeSocial:"siege",recruteur:"chloe@go",statut:"Refusé",date:"2023-05-09"},]; // Mock data to be returned by the query

  // Configure the mock behavior for db.query
  DB.query.mockImplementation((query, id, callback) => {
  // Simulate the callback with the mock user data
  callback(null, mockUserData);
  });

  modelCandidat.readUserDmdOrga('chloe@go', (results) => {
      // Assertions on the results
      expect(results).toEqual(mockUserData);
    });


  expect(DB.query).toHaveBeenCalledWith(
  'select * from DMD_ORGA where recruteur=?',
  'chloe@go',
  expect.any(Function));
});
test ("candidat : readUserDmdOrga", ()=>{
  const mockUserData = [{nom:"ComEd",siren:"3",type:"association",siegeSocial:"siege",recruteur:"chloe@go",statut:"Refusé",date:"2023-05-09"},]; // Mock data to be returned by the query

  // Configure the mock behavior for db.query
  DB.query.mockImplementation((query, id, callback) => {
  // Simulate the callback with the mock user data
  callback(null, mockUserData);
  });

  modelCandidat.readUserDmdOrga('chlo@go', (results) => {
      // Assertions on the results
      console.log("second", results);
      console.log(DB.query);
      expect(results).not.toEqual(mockUserData);
    });


  expect(DB.query).toHaveBeenCalledWith(
  'select * from DMD_ORGA where recruteur=?',
  'chlo@go',
  expect.any(Function));
});

// readUserDmdRecruteur -> pareil

// readUserDmdAdmin -> pareil

// readAllCandidature
/*
readAllCandidature: function (mail, callback) {

  db.query("select * from (CANDIDATURE c INNER JOIN OFFRE o ON c.offre=o.numero) INNER JOIN FICHE_POSTE f ON f.offre=o.numero INNER JOIN ORGANISATION ON ORGANISATION.siren=o.organisation where candidat=?", mail, function
      (err, results) {
      if (err) throw err;
      callback(results);
  });
},*/

test ("candidat : readAllCandidature", ()=>{
  const mockUserData = [{candidat:"chloe@go",offre:"6",date:"2023-05-15 15:18:25",pieces:"RFEA",etatC:"1",numero:"6",organisation:"1",etat:"publiee",dateValidite:"2023-09-09",nombrePieces:"2",intitule:"SDD",statut:"stage",responsable:"DF",type:"Association",lieu:"SF",rythme:"23",salaire:"23",description:"0x465a4546535a4546454651525151",nom:"Picasso",siren:"1",siegeSocial:"Compi"},]; // Mock data to be returned by the query

  // Configure the mock behavior for db.query
  DB.query.mockImplementation((query, id, callback) => {
  // Simulate the callback with the mock user data
  callback(null, mockUserData);
  });

  modelCandidat.readUserDmdOrga('chloe@go', (results) => {
      // Assertions on the results
      expect(results).not.toEqual(mockUserData);
    });


  expect(DB.query).toHaveBeenCalledWith(
    'select * from (CANDIDATURE c INNER JOIN OFFRE o ON c.offre=o.numero) INNER JOIN FICHE_POSTE f ON f.offre=o.numero INNER JOIN ORGANISATION ON ORGANISATION.siren=o.organisation where candidat=?',
    'chloe@go',
  expect.any(Function));
});
test ("candidat : readAllCandidature", ()=>{
  const mockUserData = [{candidat:"chloe@go",offre:"6",date:"2023-05-15 15:18:25",pieces:"RFEA",etatC:"1",numero:"6",organisation:"1",etat:"publiee",dateValidite:"2023-09-09",nombrePieces:"2",intitule:"SDD",statut:"stage",responsable:"DF",type:"Association",lieu:"SF",rythme:"23",salaire:"23",description:"0x465a4546535a4546454651525151",nom:"Picasso",siren:"1",siegeSocial:"Compi"},]; // Mock data to be returned by the query

  // Configure the mock behavior for db.query
  DB.query.mockImplementation((query, id, callback) => {
  // Simulate the callback with the mock user data
  callback(null, mockUserData);
  });

  modelCandidat.readUserDmdOrga('chlo@go', (results) => {
      // Assertions on the results
      expect(results).not.toEqual(mockUserData);
    });


  expect(DB.query).toHaveBeenCalledWith(
    'select * from (CANDIDATURE c INNER JOIN OFFRE o ON c.offre=o.numero) INNER JOIN FICHE_POSTE f ON f.offre=o.numero INNER JOIN ORGANISATION ON ORGANISATION.siren=o.organisation where candidat=?',
    'chlo@go',
  expect.any(Function));
});
// readAllOffreValide
// readOffreFiltre
// updateUser
// updateUserMdp
// updateCandidature
// creatDmdOrga
// creatDmdRecruteur
// creatDmdAdmin
// creatCandidature
// deleteCandidature
// deleteDmdOrga
// deleteDmdRecruteur
// deleteDmdRecruteurOrga
// deleteDmdAdmin


});