var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');  // ADICIONADO --------------------------
const session = require('express-session');  // ADICIONADO --------------------------
require('./auth')(passport);  // ADICIONADO --------------------------

// ADICIONADO --------------------------
function authenticationMiddleware(req, res, next) {   // Faz com que a rota seja privada  
  if (req.isAuthenticated()) return next();
  res.redirect('/login?fail=true');
}
// --------------------------

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');  // ADICIONADO --------------------------

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ADICIONADO --------------------------
app.use(session({   // POR PADRÃO É ARMAZENADA EM MEMÓRIA
  secret: '123',//configure um segredo seu aqui,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 5 * 60 * 1000 }//5min
}))
app.use(passport.initialize());
app.use(passport.session());
// --------------------------

app.use('/login', loginRouter);  // ADICIONADO -----------------------------------------
app.use('/users',authenticationMiddleware, usersRouter);  // Rota privada  
app.use('/',authenticationMiddleware, indexRouter);  // Rota privada     Mais genérica em baixo


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
