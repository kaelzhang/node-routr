'use strict';

module.exports = router;
router.Rule = Rule;
router.Router = Router;

function router (options) {
    return new Router(options);
}


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
        /(:|\*)(\w+)/g,

        // @this {Rule}
        function (match, type, name) {
            this.keys.push(name);

            return type === ':'
                ? '([^\/?]+?)'
                : '([^?]+?)';
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


function Rule (pattern) {
    this.pattern = pattern;
    this.keys = [];

    this._makeRegex();
}


Rule.prototype._makeRegex = function() {
    var route = this.pattern;

    REPLACES.forEach(function (replace) {
        var replacer = replace[1];

        if ( typeof replacer === 'function' ) {
            replacer = replacer.bind(this);
        }

        route = route.replace(replace[0], replacer);
    }, this);

    this.regex = new RegExp('^' + route + '(?:\\?(.*))?$');
};


Rule.prototype.match = function(path) {
    var match = path.match(this.regex);

    return match && this._makeObject(match);
};


Rule.prototype._makeObject = function(match) {
    var obj = {};

    this.keys.forEach(function (key, index) {
        obj[key] = match[index + 1];
    });

    return obj;
};


function Router (options) {
    
}






