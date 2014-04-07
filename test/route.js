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

    {
        disabled: true,
        desc: 'Optional segments with nested parentheses',
        route: '/page(/:a(/:b))',
        path: 'page/a/1',
        result: {
            a: 'a',
            b: 1
        }
    },

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
            var r = new routr.Route(c.route);
            var result = r.match(c.path);

            expect(result).to.deep.equal(c.result);
        });
    });
});








