
/**
 * Module dependencies.
 */

var   express = require('express')
    , routes = require('./routes')
//    , cons = require('consolidate')
//    , hogan = require('hogan.js')
    , hulk = require('hulk-hogan')
    , u = require('underscore')
    , fs = require('fs')
    , sessions = require('cookie-sessions')
    , path = require('path')
    , httpProxy = require('http-proxy')
    , app = module.exports = express.createServer();

//Extend String.prototype with format function
require('./lib/stringFormat');
require('./lib/fs-service');

var apiProxy, routingProxy, hostListRegEx = /^\/(?:familytree|identity|reservation|authorities|ct|watch|discussion|sources|links|source-links|temple)\/.*/;
routingProxy = new httpProxy.RoutingProxy();

apiProxy = function(req, res, next) {
  if (hostListRegEx.test(req.url)) {
    console.log("  proxy request: "+req.url);
    console.dir(req.session);
    if (req.user) {
      console.log("adding user sessionId=" + req.user.sessionId);
      req.url = req.url+"?sessionId="+req.user.sessionId;
    }
    if (req.session && req.session.auth && req.session.auth.familysearch && req.session.auth.familysearch.user) {
      console.dir(req.session.auth.familysearch.user);
//      console.log("adding session sessionId=" + req.session.auth.familysearch.user.sessionId);
//      req.url = req.url+"?sessionId="+req.session.auth.familysearch.user.sessionId;
    }
    return routingProxy.proxyRequest(req, res, {
      host: process.env.PROXY_HOST || "www.dev.usys.org",
      port: process.env.PROXY_PORT || 80,
      https: process.env.PROXY_HTTPS || false
    });
  } else {
    return next();
  }
};

app.configure(function(){
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(sessions({secret: '8bfa313308bda335b456de2f145a5d23d21fedaae555e701ae4cd613cea2e4ba'}));
  app.use(apiProxy);
  app.use(express.static(__dirname + '/public'));
  app.set('views', __dirname + '/views');
  app.set('view options', {layout: false});
  app.set('view engine', 'html');
  app.register('.html', hulk);
  app.use(express.bodyParser());
  app.use(express.methodOverride());
//Setup authorization handling
  require('./lib/auth')(app, {
    name: "fs-bootstrap",
    version: "0.1.0"
    //point the `baseUrl` property at your production base url.  You would probably want
    //to set the url as an ENV var and then read that var here.
    //baseUrl: "http://www.example.com/app" OR process.env.APP_BASE_URL
  });
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

app.get('/me', function(req, res){
  console.log("before render me");
  var fsclient = new FS(req.cookies['fssessionid']);
  fsclient.tree("KW79-3ZF"  ).on('complete', function(data) {
    console.log("fs-client me request complete: "+data);
    console.dir(data);
    console.dir(data[0]);
    res.render('users', {
      title: 'Me',
      users: data.pedigrees[0].persons,
      projectName: "FS-Bootstrap"
    });
  });

});

app.get('/pedigree', function(req, res){
  console.log("before render pedigree");
  var fsclient = new FS(req.cookies['fssessionid']);
  try {
    fsclient.tree("KW79-3ZF").on('complete', function (result) {
      console.log("fs-client pedigree request complete: " + result);
      console.dir(result);
      if (result instanceof Error) {
        console.log("error loading pedigree: ");
        res.render('pedigree', {
          title: 'My Pedigree Chart error',
          persons: [],
          projectName: "FS-Bootstrap"
        });
      } else {
//        console.dir(data[0]);
        res.render('pedigree', {
          title: 'My Pedigree Chart',
          persons: result.pedigrees[0].persons,
          projectName: "FS-Bootstrap"
        });
      }
    });
  } catch (e) {
    console.log("error loading pedigree: "+e);
    res.render('pedigree', {
      title: 'My Pedigree Chart',
      persons: [],
      projectName: "FS-Bootstrap"
    });
  }

});

app.get('/users', function(req, res){
  console.log("before render users");
  res.render('users', {
    title: 'Users',
    users: users,
    projectName: "FS-Bootstrap"
  });
});

app.get('/hero', function(req, res){
  console.log("before render hero");
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
  console.log("before render index, user:");
  console.dir(req.user);
  res.render('index', {
    title: 'Welcome',
    projectName: "FS-Bootstrap",
    user: req.user
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

