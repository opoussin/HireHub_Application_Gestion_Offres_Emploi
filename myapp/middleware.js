module.exports = {
    isAdminMiddleware : (req,res, next) =>{
        if(req.session.type>=3){
          return next();
        }else{
          res.redirect('/users/candidat');
        };
      },

      isRecruteurMiddleware : (req,res, next) =>{
        if(req.session.type==2){
          return next();
        }else{
          res.redirect('/users/candidat');
        };
      },

      isLoggedMiddleware : (req,res, next) =>{
        if(req.session.userid){
          return next();
        }else{
          res.redirect('/');
        };
      },

};