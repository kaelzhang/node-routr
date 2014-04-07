'use strict';

var expect = require('chai').expect;
var routr = require('../');

var routes = [
    {
        route: '/:action/:id',
        action: ':action'
    },

    {
        route: '/:action/:id/edit',
        action: 'edit'
    },

    {
        route: '/show/*name',
        action: 'show'
    }
];


var cases = [
    {
        path: '/user/123',
        result: {
            route: '/:action/:id',
            action: 'user'
        },
        params: {
            action: 'user',
            id: '123'
        }
    },

    {
        path: '/user/123/edit',
        result: {
            route: '/:action/:id/edit',
            action: 'edit'
        },

        params: {
            action: 'user',
            id: '123'
        }
    },

    {
        path: '/show/a/b/c/d',
        result: {
            route: '/show/*name',
            action: 'show'
        },
        params: {
            name: 'a/b/c/d'
        }
    }
];


describe("Router", function(){
    var r = routr(routes);

    cases.forEach(function (c) {
        it("description", function(){
            r.route(c.path, function (result, params) {
                expect(result).to.deep.equal(c.result);
                expect(params).to.deep.equal(c.params);
            });
        });
    })
});