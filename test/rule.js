'use strict';

var cases = [
    {
        desc: 'normal case',
        route: '/page/:a/:b',
        path: '/page/a/b',
        result: {
            a: 'a',
            b: 'b'
        }
    },

    {
        desc: 'normal case, lazy match',
        route: '/page/:a-:b',
        path: '/page/1-2',
        result: {
            a: '1',
            b: '2'
        }
    },

    {
        desc: 'match through',
        route: '/page/*page',
        path: '/page/a/b',
        result: {
            page: 'a/b'
        }
    },

    // {
    //     route: '/page/*'
    // }

    // {
    //     desc: 'optional segmants, unoptional',
    //     route: '/page(/:a(/:b))',
    //     path: '/page',
    //     result: {}
    // },

    // {
    //     desc: 'optional segmants, matched optional parts',
    //     route: '/page(/:a(/:b))',
    //     path: 'page/a/1',
    //     result: {
    //         a: 'a',
    //         b: 1
    //     }
    // }
];


var expect = require('chai').expect;
var routr = require('../');

describe("Roule patterns", function(){
    cases.forEach(function (c) {
        it(c.desc, function(){
            var r = new routr.Rule(c.route);
            var result = r.match(c.path);

            expect(result).to.deep.equal(c.result);
        });
    });
});








