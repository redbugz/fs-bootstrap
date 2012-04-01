
/**
 * Module dependencies.
 */

var   express = require('express')
    , routes = require('./routes')
    , cons = require('consolidate')
    , hogan = require('hogan.js')
    , u = require('underscore')
    , fs = require('fs')
    , app = express();

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
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

var users = [];
users.push({ name: 'tobi' });
users.push({ name: 'loki' });
users.push({ name: 'jane' });

app.get('/users', function(req, res){
  console.log("before render");
  res.render('users', {
    title: 'Users',
    users: users
  });
});

app.get('/hero', function(req, res){
  console.log("before render");
  res.render('hero', {
    title: 'Hero',
    users: users
  });
});

app.get('/', routes.index);

app.listen(3002);
console.log("Express server listening on port %d in %s mode", 3002/*app.address().port*/, app.settings.env);

