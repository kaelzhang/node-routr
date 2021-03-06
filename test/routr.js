'use strict';

var cases = [
    {
        desc: 'Normal case',
        route: '/page/:a/:b',
        path: '/page/a/b',
        result: {
            a: 'a',
            b: 'b'
        }
    },

    {
        desc: 'Normal case, lazy match',
        route: '/page/:a-:b',
        path: '/page/1-2',
        result: {
            a: '1',
            b: '2'
        }
    },

    {
        desc: 'Optional segments denoted by parentheses',
        route: '/page(/:a)',
        path: '/page',
        result: {}
    },

    // // Easy to make mistakes
    // {
    //     desc: 'Optional segments with nested parentheses',
    //     route: '/page(/:a(/:b))',
    //     path: 'page/a/1',
    //     result: {
    //         a: 'a',
    //         b: '1'
    //     }
    // },

    // // Easy to make mistakes
    // {
    //     desc: 'Optional segments, which might be treated wrong by parser',
    //     route: '/page(s)(/:b)',
    //     path: 'pages/a',
    //     result: {
    //         b: 'a'
    //     }
    // },

    {
        desc: 'Route globbing and wildcard segments',
        route: '/page/*page',
        path: '/page/a/b',
        result: {
            page: 'a/b'
        }
    },

    {
        desc: 'Route globbing and wildcard segments: lazy match',
        route: '/page/*section/:title',
        path: '/page/a/c/this-is-a-title',
        result: {
            section: 'a/c',
            title: 'this-is-a-title'
        }
    },

    {
        desc: 'Ending simple wildcards',
        route: '/page/*',
        path: '/page/a/c/this-is-a-title',
        result: {}
    },

    {
        desc: 'Ending simple wildcards, non matches',
        route: '/page/*/',
        path: '/page/a/c/this-is-a-title',
        result: null
    },

    {
        desc: 'Simple wildcards in the middle',
        route: '/page/*/:title',
        path: '/page/a/c/this-is-a-title',
        result: {
            title: 'this-is-a-title'
        }
    }
];


var expect = require('chai').expect;
var routr = require('../');

describe("Roule patterns", function(){
    cases.forEach(function (c) {
        if ( c.disabled ) {
            return;
        }

        it(c.desc, function(){
            var r = routr(c.route);
            var result = r.match(c.path);

            expect(result).to.deep.equal(c.result);
        });
    });
});








