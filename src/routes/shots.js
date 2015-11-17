
var Route = require('../route.js');

module.exports = exports = [
    new Route([
        new Route.URI('get', '/shots'),
        new Route.URI('get', '/shots/:itemPerPage'),
        new Route.Response(function(req, res) {
            res.end('hello world');
        })
    ]),
    new Route([
        new Route.URI('get', '/shot'),
        new Route.URI('get', '/shot/:itemPerPage'),
        new Route.Response(function(req, res) {
            res.end('hello world 2');
        })
    ])
];

