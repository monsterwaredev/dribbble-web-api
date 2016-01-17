
var Route = require('../route.js');

module.exports = exports = [
    new Route([
        new Route.URI('get', '/shots'),
        new Route.URI('get', '/shots/:page', {
            page: new Route.Validator(function(value, utility) {
                return utility.isNumber(value) ? true : 'page value has to be a number';
            })
        }),
        new Route.Response(function(err, req, res) {
            this.cache().serve(function retrieve(cache) {
                if (cache && cache.seconds() < 60) {
                    return this.end(cache.data());
                }
                return false;
            }).fetch(function download(done) {
                this.parent().parent().get('api').shots(function(err, obj) {
                    done(err, obj);
                });
            }).save(60, function done(err, obj, cache) {
                this.end(obj);
            });
        })
    ]),
    new Route([
        new Route.URI('get', '/shot'),
        new Route.URI('get', '/shot/:itemPerPage'),
        new Route.Response(function(err, req, res) {
            res.end('hello world 2');
        })
    ])
];

