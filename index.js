'use strict';

module.exports = router;

router.Route = require('./lib/route');
router.Router = Router;


var util = require('util');

function router (routes) {
    return new Router(routes);
}


// @param {Array} routes
// [
//     {
//         route: '/:action/:id',
//         defaults: {
//             title: 'my-title'
//         },
//         constraints: {
//             id: /\d+/
//         },
//         other_property: 'blah-blah'
//     }
// ]
function Router (routes) {
    routes = util.isArray(routes)
        ? routes
        : [routes];

    routes = routes.filter(function (route) {
        return route && route.route; 
    });

    this.routes = routes;
    this._routes = routes.map(function (route) {
        return new router.Route(route.route, route); 
    });
}


Router.prototype.route = function(path, callback) {
    this._routes.some(function (route, index) {
        var params = route.match(path);

        if ( params ) {
            var matched = this.routes[index];
            var substituted = this._apply(matched, params);
            console.log(params, matched, substituted)
            callback(substituted, params);

            return true;
        }

    }, this);

    callback(null);
};


Router.prototype._apply = function(object, params) {
    var ret = {};

    this._each(object, function (value, key) {
        if ( key !== 'route' && util.isString(value) ) {
            value = this._substitute(value, params);
        }

        ret[key] = value;
    });

    return ret;
};


Router.prototype._substitute = function(template, params) {
    this._each(params, function (value, key) {
        template = template.replace( new RegExp(':' + key, 'g'), value ); 
    });

    return template;
};


Router.prototype._each = function(object, callback) {
    var key;
    var value;

    for (key in object) {
        value = object[value];

        callback(value, key);
    }
};



