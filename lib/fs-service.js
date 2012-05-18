var rest = require('restler');

FS = rest.service(function(session) {
  this.defaults.sessionId = session;
}, {
  baseURL: 'http://www.dev.usys.org'
}, {
  update: function(message) {
    return this.post('/statuses/update.json', { data: { status: message } });
  },
  me: function(session) {
    return this.get('/familytree/v2/person', { query: {sessionId:session} });
  },
  tree: function(id) {
    return this.get('/familytree/v2/pedigree/'+id, { query: {properties:"all",ancestors:4,'sessionId': this.defaults.sessionId, 'dataFormat': "application/json"}, headers: { 'Accept': 'application/json', 'User-Agent': 'Restler for node.js' , 'Cookie': "fssessionid="+this.defaults.sessionId} });
  }
});

