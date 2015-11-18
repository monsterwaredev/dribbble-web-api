
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

Route.Validator = function Validator() {
    Base.call(this, {});
    var validations = [];
    for (var i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] === 'function') {
            validations.push(arguments[i]);
        } else {
            this.throw('validator has to be a function type object');
        }
    }
    this.set('validations', validations);
};

Route.Validator.Utility = {
    isNumber: function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n) && /^\d+$/.test(n);
    }
};

Route.Validator.prototype = Object.create(Base.prototype);
Route.Validator.prototype.constructor = Route.Validator;

Route.Validator.prototype.check = function(value) {
    var errs = [];
    for (var i = 0; i < this.get('validations').length; i++) {
        var checker = this.get('validations')[i],
            res = checker.call(undefined, value, Route.Validator.Utility);
        if (typeof res === 'string') {
            errs.push(res);
        }
    }
    return errs;
};

/**
 * Route.URI {{Object}}
 */
Route.URI = function URI(method, uri, validation, options) {
    Base.call(this, options);
    this.set('method', method);
    this.set('uri', uri);
    this.set('validation', validation);
};

Route.URI.prototype = Object.create(Base.prototype);
Route.URI.prototype.constructor = Route.URI;

/**
 * Route.Response {{Object}}
 */
Route.Response = function Response(callback, options) {
    Base.call(this, options);
    this.set('callback', function(err, req, res) {
        if (typeof callback === 'function') {
            callback.call(this, err, req, res);
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
                app[uri.get('method')].call(app, uri.get('uri'), function(req, res) {
                    var errors = [],
                        validation = uri.get('validation');
                    if (typeof validation === 'object') {
                        var params = Object.keys(validation);
                        for (var k = 0; k < params.length; k++) {
                            var param = params[k],
                                validator = validation[params[k]];
                            if (typeof validator === 'object' && validator instanceof Route.Validator) {
                                var value,
                                    vres;
                                if (typeof req.params[param] !== 'undefined') {
                                    value = req.params[param];
                                }
                                if (typeof req.body[param] !== 'undefined') {
                                    value = req.body[param];
                                }
                                vres = validator.check(value);
                                if (typeof vres === 'object' && vres instanceof Array) {
                                    Array.prototype.push.apply(errors, vres);
                                }
                            }
                        }
                    }
                    if (errors instanceof Array && errors.length === 0) {
                        errors = undefined;
                    }
                    response.get('callback').call(this, errors, req, res);
                });
            }
        }
    }
};

module.exports = exports = Route;
