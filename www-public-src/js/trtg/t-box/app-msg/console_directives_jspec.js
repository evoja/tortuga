'use strict';

describe('Console directives', function()
{
    var $compile;
    var $rootScope;

    var ns_get = om.ns_get;
    var curry = ns_get('om.func.curry');
    var tang_get = function(postfix){return ns_get('trtg.tbox.app_msg.' + postfix)};
    angular.module('console_directives_test_module', ['t_box_module.TBoxTortoiseCanvas'])
        .service('dispatcher_service',
                    tang_get('DispatcherService'))
        .controller('DispatcherController',
                    ['$scope', 'dispatcher_service', tang_get('DispatcherController')])
        .directive('consoleOut',
                    curry(tang_get('ConsoleOutDirective'), 'DispatcherController', 'controller_field'))
        .directive('consoleIn',
                    curry(tang_get('ConsoleInDirective'), 'DispatcherController', 'controller_field'))
        ;
    beforeEach(module('console_directives_test_module'));

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function(_$compile_, _$rootScope_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    it('console-out', function()
    {
        var scope = $rootScope.$new();
        // Compile a piece of HTML containing the directive
        var element = $compile('<div console-out></div>')(scope);
        scope.controller_field.dispatch('ololo');
        expect(element.html()).toEqual('ololo');
        scope.controller_field.dispatch('alala');
        expect(element.html()).toEqual('ololoalala');
    });
});