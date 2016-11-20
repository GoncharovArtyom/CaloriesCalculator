var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//Connection to save sessions
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  port: '3307',
  user: 'root',
  password: 'ArTyOm73',
  database: 'session_test'
});
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var sessionStore = new MySQLStore({
  checkExpirationInterval: 900000,
  expiration: 86400000,
  createDatabaseTable: true
}, connection);


var index = require('./routes/index');
var mainpage = require('./routes/mainpage');

var db = require('./db.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  key: 'session_cookie_name',
  secret: 'session_cookie_secret',
  store: sessionStore,
  resave: true,
  saveUninitialized: true
}));

//Подключение модуля с базой данных
db.connect(db.MODE_TEST,function(){
  console.log('connected!');
});
//Добавление данных
/*tables = ['users'];
var data = {
  'tables':{
    users:[
      {user_name:'Ivan', user_password:'1234', user_email:'098@mail.ru'},
      {user_name:'Max', user_password:'1234', user_email:'098@gmail.ru'},
      {user_name:'Nick', user_password:'1234', user_email:'0987@mail.ru'}
    ]
  }
}
db.drop(tables,function(){
  console.log('dropped!');
})
db.fixtures(data,function(){
  console.log('inserted!');
})*/
/*
var user  = {
  user_name:'Kolya',
  user_password: '4321',
  user_email: 'qwer@r.ru'
};
db.findUserByEmail('098@mail.ru',function(err, result){
  if (result){
    console.log(result);
  } else {
    console.log('Did not find');
  }
})
*/
app.use('/', index);
app.use('/mainpage', mainpage);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next){
    if (req.errStatus){
        console.log(req.errStatus);
        console.log(err.message)
        res.sendStatus(401)
    } else {
        next(err)
    }
})
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
    console.log(err)
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
});

module.exports = app;

var pool = db.get();

//db.startTransaction(function(){});
