'use strict';

describe('DispatcherController', function()
{
    var scope;
    var service;

    var ns_get = om.ns_get;
    angular.module('dispatcher_controller_test_module', [])
        .service('dispatcher_service',
                    ns_get('trtg.tbox.app_msg.DispatcherService'))
        .controller('DispatcherController',
                    ['$scope', 'dispatcher_service', ns_get('trtg.tbox.app_msg.DispatcherController')]);


    beforeEach(module('dispatcher_controller_test_module'));

    // injection du service $controller et du $rootScope, 
    // attention l'identification du service se fait sur son nom
    // il faut bien respecter $controller et pas écrire $controleur
    beforeEach(inject(['dispatcher_service', '$controller', '$rootScope', function(serv, $controller, $rootScope) {
        // creation du controller avec le nouveau scope
        scope = $rootScope.$new();
        var controller = $controller('DispatcherController', {
            $scope: scope
        });
        service = serv;
    }]));

    it('test dispatches', function()
    {
        var str;
        var handler = function(value){str = value;};
        scope.add_handler(handler);
        scope.dispatch('hello');
        expect(str).toEqual('hello');
        service.dispatch('service says hello');
        expect(str).toEqual('service says hello');
        scope.remove_handler(handler);
        scope.dispatch('ololo');
        expect(str).not.toEqual('ololo');
        service.dispatch('service says ololo');
        expect(str).not.toEqual('service says ololo');
    });

    it('test unsubscribes on scope destroying', function()
    {
        var str;
        var handler = function(value){str = value;};
        scope.add_handler(handler);
        service.dispatch('hello');
        expect(str).toEqual('hello');
        scope.$destroy();
        service.dispatch('ololo');
        expect(str).not.toEqual('ololo');
    });

    it('Test returns from one handler', function()
    {
        var handler = function(value){return value + '1';};
        scope.add_handler(handler);
        var result = scope.dispatch('hello');
        expect(result).toEqual('hello1');
        scope.remove_handler(handler);
    });

    it('Test doesnt return from more than one handler', function()
    {
        var handler1 = function(value){return value + '1';};
        var handler2 = function(value){return value + '2';};
        var result = scope.dispatch('hello');
        expect(result).toBeUndefined();
        scope.remove_handler(handler1);
        scope.remove_handler(handler2);
    });
});