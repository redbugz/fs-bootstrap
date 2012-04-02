
/**
 * Module dependencies.
 */

var   express = require('express')
    , routes = require('./routes')
    , cons = require('consolidate')
    , hogan = require('hogan.js')
    , u = require('underscore')
    , fs = require('fs')
    , sessions = require('cookie-sessions')
    , path = require('path')
    , app = express();

//Extend String.prototype with format function
require('./lib/stringFormat');

app.configure(function(){
  app.engine('html', cons.hogan);
  app.set('view engine', 'html');
  app.set('views', __dirname + '/views');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.static(__dirname + '/public'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(sessions({secret: '8bfa313308bda335b456de2f145a5d23d21fedaae555e701ae4cd613cea2e4ba'}));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

//Setup authorization handling
require('./lib/auth')(app, {});

var users = [];
users.push({ name: 'tobi' });
users.push({ name: 'loki' });
users.push({ name: 'jane' });

app.get('/users', function(req, res){
  console.log("before render");
  res.render('users', {
    title: 'Users',
    users: users,
    projectName: "FS-Bootstrap"
  });
});

app.get('/hero', function(req, res){
  console.log("before render");
  res.render('hero', {
    title: 'Hero',
    users: users,
    projectName: "FS-Bootstrap"
  });
});

app.get('/about', function(req, res){
  res.render('about', {
    title: 'About this project',
    users: users,
    projectName: "FS-Bootstrap"
  });
});

app.get('/', function(req, res){
  console.log("before render");
  res.render('index', {
    title: 'Welcome',
    projectName: "FS-Bootstrap"
  });
});

// The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
  res.statusCode = 404;
  res.setHeader("Content-Type", "text/html; charset=utf8");
  res.render('errors/404');
});

var port = process.env.PORT || 3000;

app.listen(port);
console.log("Express server listening on port %d in %s mode", port/*app.address().port*/, app.settings.env);

