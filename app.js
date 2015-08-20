var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    config = require('./config');

// Mongoose
var mongoose = require('mongoose');
mongoose.connect(config.db.mongodb, function(err) {
  if(err) {
    console.log('connection error', err);
  } else {
    console.log('connection successful');
  }
});
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {});

var product = require('./server/model/product');
var order = require('./server/model/order');

var routes = require('./server/routes/index');
var products = require('./server/routes/api/product');
var orders = require('./server/routes/api/order');

var app = express();

// Using React engine - render *.jade
app.set('views', path.join(__dirname, './server/views/jade'));
app.set('view engine', 'jade');

// Using React engine - render *.jsx
// app.set('views', path.join(__dirname, './server/views/jsx'));
// app.set('view engine', 'jsx');
// var options = { beautify: true };
// app.engine('jsx', require('express-react-views').createEngine(options));

// uncomment after placing your favicon in /client
//app.use(favicon(path.join(__dirname, 'client', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client')));

app.use('/', routes);
app.use('/api/products', products);
app.use('/api/orders', orders);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
