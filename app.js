var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var exphbs = require('express-handlebars');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.get('/views/path', (req, res)=>{
  res.send(path.join(__dirname, 'views'))
})

// 用 /static 访问 ./views下的资源
app.use('/static', express.static('./views'));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade'); // 设置默认视图引擎 为 jade
app.engine('html', exphbs({
  layoutsDir: 'views',
  defaultLayout: 'layout',
  extname: '.html'
}));
app.set('view engine', 'html');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
