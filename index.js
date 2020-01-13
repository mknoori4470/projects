var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;
var bodyParser = require('body-parser')
var routes = require('./convert/routes/convertRoutes');
var session = require('express-session');
var flash = require('connect-flash');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.listen(port);
app.set('views', __dirname + '/convert/views');
app.set('view engine', 'pug');
app.use(flash());
app.use('/', routes);

app.use(session({ cookie: { maxAge: 60000 }, 
  secret: 'woot',
  resave: false, 
  saveUninitialized: false}));

  app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });