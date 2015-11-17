
var Base  = require('./base.js');
var Route = require('./route.js');

var Server = function Server(options) {
    'use strict';
    Base.call(this, options);
};

Server.CONFIG = {
    EXTENSION: '.js',
    ROUTES: 'routes'
};

Server.prototype = Object.create(Base.prototype);
Server.prototype.constructor = Server;

Server.prototype._init = function() {
    this.require([
        { id: 'express', ref: 'express' },
        { id: 'fs', ref: 'fs' }
    ]);
    this.set('app', this.require('express')());
    this.set('server', this.get('app').listen(process.env.PORT || 3000, function () {
        var server = this.get('server');
        var host = server.address().address;
        var port = server.address().port;
        this.log('http://{0}:{1}', host, port);
        this.attach();
    }.bind(this)));
};

Server.prototype._lookupRoutes = function() {
    return this.require('fs').readdirSync([__dirname, Server.CONFIG.ROUTES].join('/')).forEach(function(file) {
        if (file.indexOf(Server.CONFIG.EXTENSION) === (file.length - Server.CONFIG.EXTENSION.length)) {
            var module = require([__dirname, Server.CONFIG.ROUTES, file].join('/'));
            if (typeof module === 'object' && module instanceof Array) {
                for (var i = 0; i < module.length; i++) {
                    if (typeof module[i] === 'object' && module[i] instanceof Route) {
                        module[i].attach(module[i], this.get('app'));
                    }
                }
            }
        }
    }.bind(this));
};

Server.prototype.attach = function() {
    return this._lookupRoutes();
};

module.exports = exports = Server;
