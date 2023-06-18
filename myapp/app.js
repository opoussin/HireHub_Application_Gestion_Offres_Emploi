var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var middleware = require('./middleware');
const session = require('express-session'); 
var crypto = require('crypto'); // rajout antoine
var session2=require('./Modele/session');
var cors=require('cors');//rajout


var app = express();
app.use(session2.init());//rajout



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var recrutRouter = require('./routes/recrut');
var adminRouter = require('./routes/admin');
var uploadRouter = require('./routes/upload');
var apiRouter = require('./routes/api');

app.use(cookieParser());
//AUTHENTIFICATION
/*
const generateRandomKey = (length) => {
  return crypto.randomBytes(length).toString('hex');
};

const keyLength = 32; // Longueur de la clé en octets
const randomKey = generateRandomKey(keyLength);


const deuxHeures = 1000*60*60*2;

app.use(session({
  secret: randomKey,
  resave: false,
  saveUninitialized :true,
  cookie: {httpOnly: true, secure: false, maxAge: deuxHeures}
}));*/
// FIN AUTHENTIFICATION

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static('public'));
app.use(cors());//rajout


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/recrut', recrutRouter);
app.use('/admin', adminRouter);
app.use('/api', apiRouter);
app.use('/candidature', uploadRouter);

//à enlever
//____________________________



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



module.exports = app;
