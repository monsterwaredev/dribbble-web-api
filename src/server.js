
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
        { id: 'body-parser', ref: 'body-parser' },
        { id: 'hpp', ref: 'hpp' },
        { id: 'fs', ref: 'fs' },
        { id: 'dribbble', ref: 'dribbble-node-api' }
    ]);
    this.set('app', this.require('express')());
    this.get('app').use(this.require('body-parser').json());
    this.get('app').use(this.require('body-parser').urlencoded({ extended: true }));
    this.get('app').use(this.require('hpp')());
    this.set('server', this.get('app').listen(process.env.PORT || 3000, function () {
        // get server and its information
        var server = this.get('server'),
            host = server.address().address,
            port = server.address().port;
        this.log('http://{0}:{1}', host, port);
        this.dribbble();
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
                        module[i]
                            .set('parent', this)
                            .attach(module[i], this.get('app'));
                    }
                }
            }
        }
    }.bind(this));
};

Server.prototype.attach = function() {
    return this._lookupRoutes();
};

Server.prototype.dribbble = function() {
    // set up dribbble api instance
    var dribbble = new (this.require('dribbble'));
    // set access_token
    dribbble.set('access_token', 'ddd74328bb9bbf4645a5ced13514e3fefd6e7fafc1b8b0a9d3b8f27581ac7ce3');
    // set access point
    this.set('api', dribbble);
};

module.exports = exports = Server;
