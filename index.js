'use strict';

module.exports = routr;
routr.Routr = Routr;

function routr (pattern, options) {
    return new Routr(pattern, options);
}

var util = require('util');


var REPLACES = [
    [
        // Some chars need to be escaped or 
        // they will be transcribed into key words when `new RegExp`
        /[\-{}\[\]+?.,\\\^$|#\s]/g, 
        '\\$&'
    ],

    [
        // Ungroup the optional group, 
        // so the matched parts of route patterns should not be ruined 
        // '(abc)' -> '(?:abc)?'
        /\((.*?)\)/g,
        '(?:$1)?'
    ],

    [
        // Named parameters or wildcard segments
        /(:|\*)(\w+)?/g,

        // @this {Routr}
        function (match, type, name) {
            var replace;

            if ( type === ':' ) {
                if ( name ) {
                    replace = '([^\/?]+?)';
                } 
                // else do not replace, to avoid replacing `(?:xxx)`

            } else {
                replace = '([^?]+?)';
            }

            if ( replace ) {
                this.keys.push(name);
            }

            return replace || match;
        }
    ]
];


// Cached regular expressions for matching named param parts and splatted
// parts of route strings.
var optionalParam = /\((.*?)\)/g;
var namedParam    = /(\(\?)?:\w+/g;
var splatParam    = /\*\w+/g;
var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

// route = route.replace(escapeRegExp, '\\$&')
//     .replace(optionalParam, '(?:$1)?')
//     .replace(namedParam, function(match, optional) {
//      return optional ? match : '([^/?]+)';
//     })
//     .replace(splatParam, '([^?]*?)');


// @param {Object} options
// - constraints: 
// - defaults: 
function Routr (pattern, options) {
    this.pattern = pattern;
    this.keys = [];

    this._makeRegex();
}


function isFunction (subject) {
    return typeof subject === 'function';
}


Routr.prototype._makeRegex = function() {
    var route = this.pattern;

    REPLACES.forEach(function (replace) {
        if ( util.isFunction(replace) ) {
            route = replace.call(this, route);
            return;
        }

        var replacer = replace[1];

        if ( util.isFunction(replacer) ) {
            replacer = replacer.bind(this);
        }

        route = route.replace(replace[0], replacer);
    }, this);

    this.regex = new RegExp('^' + route + '(?:\\?(.*))?$');
};


Routr.prototype.match = function(path) {
    var match = path.match(this.regex);

    return match && this._makeObject(match);
};


Routr.prototype._makeObject = function(match) {
    var obj = {};

    this.keys.forEach(function (key, index) {
        // There are wildcards without names
        if ( key ) {
            var part = match[index + 1];

            if ( part ) {
                obj[key] = part;
            }
        }        
    });

    return obj;
};

