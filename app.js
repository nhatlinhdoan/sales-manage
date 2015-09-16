var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    config = require('./config');

var expressJwt = require('express-jwt');

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

// Model
var product = require('./model/Product');
var order = require('./model/Order');
var orderitem = require('./model/OrderItem');
var user = require('./model/User');
var userInfo = require('./model/UserInfo');

// routes
var routes = require('./routes/index');

// API
var productAPI = require('./api/product');
var orderAPI = require('./api/order');
var userAPI = require('./api/user');
var auth = require('./authentication/authentication');

var app = express();

// Using React engine - render *.jade
app.set('views', path.join(__dirname, './views/jade'));
app.set('view engine', 'jade');

// Using React engine - render *.jsx
// app.set('views', path.join(__dirname, './views/jsx'));
// app.set('view engine', 'jsx');
// var options = { beautify: true };
// app.engine('jsx', require('express-react-views').createEngine(options));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/authentication', auth);
// app.use('/api', expressJwt({secret: secret}));
app.use('/api/products', productAPI);
app.use('/api/orders', orderAPI);
app.use('/api/user', userAPI);

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
