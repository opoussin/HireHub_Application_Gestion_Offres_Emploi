var sessions = require("express-session");
var crypto = require('crypto'); // rajout antoine

module.exports = {
  init: () => {
    const generateRandomKey = (length) => {
        return crypto.randomBytes(length).toString('hex');
      };
      
    const keyLength = 32; // Longueur de la clé en octets
    const randomKey = generateRandomKey(keyLength);
    return sessions({
        
      secret: randomKey,
      saveUninitialized: true,
      cookie: {httpOnly: true, maxAge: 3600 * 1000 }, // 60 minutes
      resave: false,
    });
  },

  deleteSession: function (session) {
    session.destroy();
  },
};
