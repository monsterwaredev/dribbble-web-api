
var Base = require('./base.js');

/**
 * Route {{Object}}
 */
var Route = function Route(routes, options) {
    Base.call(this, options);
    this._patch(routes);
};

Route.prototype = Object.create(Base.prototype);
Route.prototype.constructor = Route;

/**
 * Route.URI {{Object}}
 */
Route.URI = function URI(method, uri, options) {
    Base.call(this, options);
    this.set('method', method);
    this.set('uri', uri);
};

Route.URI.prototype = Object.create(Base.prototype);
Route.URI.prototype.constructor = Route.URI;

/**
 * Route.Response {{Object}}
 */
Route.Response = function Response(callback, options) {
    Base.call(this, options);
    this.set('callback', function(req, res) {
        if (typeof callback === 'function') {
            callback.call(this, req, res);
        }
    }.bind(this));
};

Route.Response.prototype = Object.create(Base.prototype);
Route.Response.prototype.constructor = Route.Response;

Route.prototype._patch = function(routes) {
    if (typeof routes === 'object' && routes instanceof Array) {
        var response,
            uris = [];
        for (var idx in routes) {
            var item = routes[idx];
            if (typeof item === 'object' && item instanceof Route.URI) {
                uris.push(item);
            } else if (typeof callback === 'undefined' && typeof item === 'object' && item instanceof Route.Response) {
                response = item;
            }
        }
        if (typeof response === 'object') {
            response.set('routes', uris);
        } else {
            this.throw('please provide a callback for route');
        }
        this.set('routes', uris);
        this.set('response', response);
    }
};

Route.prototype.attach = function(routes, app) {
    var routes = this.get('routes'),
        response = this.get('response');
    if (typeof routes === 'object' && routes instanceof Array) {
        if (typeof response === 'object' && typeof response.get('callback') === 'function') {
            for (var i = 0; i < routes.length; i++) {
                var uri = routes[i];
                app[uri.get('method')].call(app, uri.get('uri'), response.get('callback'));
            }
        }
    }
};

module.exports = exports = Route;
