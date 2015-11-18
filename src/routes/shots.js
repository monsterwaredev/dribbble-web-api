
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
            console.log(err);
            res.end('hello world');
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

