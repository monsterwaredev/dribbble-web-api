
(function() {

    // patch process
    require('./inject.js');
    // require server module
    var Server = require('./server.js');
    // create server instance
    new Server();

}.call(this));

