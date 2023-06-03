var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var middleware = require('./middleware');
const session = require('express-session'); 
var crypto = require('crypto'); // rajout antoine

var app = express();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var recrutRouter = require('./routes/recrut');
var adminRouter = require('./routes/admin');
var uploadRouter = require('./routes/upload');
var apiRouter = require('./routes/api');

//AUTHENTIFICATION
app.use(cookieParser());
const deuxHeures = 1000*60*60*2;

app.use(session({
  secret: "chutcestunsecret",
  resave: false,
  saveUninitialized :true,
  cookie: {secure: false, maxAge: deuxHeures}
}));
// FIN AUTHENTIFICATION

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static('public'));

usersRouter.use(middleware.isLoggedMiddleware);
recrutRouter.use(middleware.isLoggedMiddleware);
adminRouter.use(middleware.isLoggedMiddleware);
adminRouter.use(middleware.isAdminMiddleware);
recrutRouter.use(middleware.isRecruteurMiddleware);
uploadRouter.use(middleware.isLoggedMiddleware);


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/recrut', recrutRouter);
app.use('/admin', adminRouter);
app.use('/api', apiRouter);

//à enlever
//____________________________


app.use('/candidature', uploadRouter);

//____________________________

app.get('/dump-session',(req, res, next)=>{
  res.json(req.session);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/*var cors=require('cors');
app.use(cors());
*/
module.exports = app;
