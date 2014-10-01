var express = require('express');
var fs      = require('fs');
var https   = require('https');
var session = require('express-session');
var request = require('request');
var querystring = require('querystring');
var url = require('url');
var privateKey  = fs.readFileSync('cert/key.pem', 'utf8');
var certificate = fs.readFileSync('cert/cert.pem', 'utf8');
var app     = express();
var credentials = {key: privateKey, cert: certificate};
var httpsServer = https.createServer(credentials, app);

app.use(express.static('public'));
app.use(session({
  secret: '[noun] 1. something that is kept or meant to be kept unknown or unseen by others.',
  resave: true,
  saveUninitialized: true
}));

// build redirect url and go there
app.get('/request', function(req, res){
  req.session.query = req.query;
  var params = {
    'redirect_uri': req.query.redirectURI,
    'client_id': req.query.clientId,
    'response_type': req.query.response_type || 'code',
    'access_type': req.query.access_type || 'offline',
    'scope': req.query.scope.replace(/[^a-zA-Z\s]/g, '')
  };
  var baseUri = decodeURIComponent(req.query.oauthURL);
  var redirectTo = [baseUri, querystring.stringify(params)].join('?');
  res.redirect(redirectTo);
});

// get code (or error) and request refresh token/access token
app.get('/code', function(req, res){
  var msg = { 'error': 'Unknown error occurred (helpful, amiright?)' };
  if(req.query.error){
    res.json({ 'error': req.query.error });
    return res.end();
  } else {
    if(req.query.code && req.session.query){
      var postData = {
        'code': req.query.code,
        'client_id': req.session.query.clientId,
        'client_secret': req.session.query.clientSecret,
        'redirect_uri': req.session.query.redirectURI,
        'grant_type': 'authorization_code'
      };
      request.post(req.session.query.tokenURI, { json: true, form: postData }, function(err, response, body){
        if(err){
          msg = err;
        } else {
          var filename = url.parse(req.session.query.tokenURI).hostname;
          res.setHeader('Content-disposition', 'attachment; filename='+filename+'-oauth-credentials.json');
          res.setHeader('Content-type', 'text/plain');
          res.charset = 'UTF-8';
          res.write(JSON.stringify(body));
          return res.end();
        }
      });
    } else {
      res.json({ 'error': 'No code or session found' });
      return res.end();
    }
  }
});

var port = process.env.PORT || 3300;
app.listen(port);
httpsServer.listen(443);
