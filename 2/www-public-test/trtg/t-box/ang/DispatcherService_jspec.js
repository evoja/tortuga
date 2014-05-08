'use strict';

describe('DispatcherService', function()
{
    beforeEach(module('t_box_module'));

    var service;
    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(['DispatcherService', function(serv){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        service = serv;
    }]));

    it('test', function()
    {
        expect(service).toBeDefined();
        expect(service).not.toBeNull();

        var str;
        var handler = function(value){str = value;};
        service.add_handler(handler);
        service.dispatch("hello");
        expect(str).toEqual("hello");
        service.remove_handler(handler);
        service.dispatch("ololo");
        expect(str).not.toEqual("ololo");
    });
});