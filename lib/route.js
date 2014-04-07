'use strict';

module.exports = Route;


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
        // Named parameters
        /(:|\*)(\w+)?/g,

        // @this {Route}
        function (match, type, name) {
            var replace;

            if ( type === ':' ) {
                if ( name ) {
                    replace = '([^\/?]+?)';
                } 
                // else do not replace

            } else {
                replace = '([^?]+?)';
            }

            if ( replace ) {
                this.keys.push(name);
            }            

            return replace || match;
        }
    ]

    // .replace(REGEX_NAMED_PARAM, function(match, optional) {
    //     return optional ? match : '([^/?]+)';
    // })
    // .replace(splatParam, '([^?]*?)');
];


// The first group was what `REGEX_OPTIONAL_GROUP` replaced with.\
// '/(:city)?' -> '/(?::city)?'
// var REGEX_NAMED_PARAM       = /(\(\?)?:\w+/g;

// var REGEX_    = /\*\w+/g; 


// @param {Object} options
// - constraints: 
// - defaults: 
function Route (pattern, options) {
    this.pattern = pattern;
    this.keys = [];

    this._makeRegex();
}


function isFunction (subject) {
    return typeof subject === 'function';
}


Route.prototype._makeRegex = function() {
    var route = this.pattern;

    REPLACES.forEach(function (replace) {
        if ( isFunction(replace) ) {
            route = replace.call(this, route);
            return;
        }

        var replacer = replace[1];

        if ( isFunction(replacer) ) {
            replacer = replacer.bind(this);
        }

        route = route.replace(replace[0], replacer);
    }, this);

    this.regex = new RegExp('^' + route + '(?:\\?(.*))?$');
};


Route.prototype.match = function(path) {
    var match = path.match(this.regex);

    return match && this._makeObject(match);
};


Route.prototype._makeObject = function(match) {
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

