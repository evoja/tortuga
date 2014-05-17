'use strict';

describe('DispatcherService', function()
{
    angular.module('dispatcher_service_test_module', [])
        .service('dispatcher_service',
                    om.ns_get('trtg.tbox.app_msg.DispatcherService'))

    beforeEach(module('dispatcher_service_test_module'));

    var service;
    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(['dispatcher_service', function(serv){
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
        service.dispatch('hello');
        expect(str).toEqual('hello');
        service.remove_handler(handler);
        service.dispatch('ololo');
        expect(str).not.toEqual('ololo');
    });

    it('Test returns from one handler', function()
    {
        var handler = function(value){return value + '1';};
        service.add_handler(handler);
        var result = service.dispatch('hello');
        expect(result).toEqual('hello1');
        service.remove_handler(handler);
    });

    it('Test doesnt return from more than one handler', function()
    {
        var handler1 = function(value){return value + '1';};
        var handler2 = function(value){return value + '2';};

        service.add_handler(handler1);
        expect(service.dispatch('hello')).toEqual('hello1');

        service.add_handler(handler2);
        expect(service.dispatch('hello')).toBeUndefined();

        service.remove_handler(handler1);
        expect(service.dispatch('hello')).toEqual('hello2');

        service.remove_handler(handler2);
        expect(service.dispatch('hello')).toBeUndefined();
    });
});