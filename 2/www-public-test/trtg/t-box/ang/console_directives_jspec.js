'use strict';

describe('Console directives', function()
{
    var $compile;
    var $rootScope;

    beforeEach(module('t_box_module'));

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
        var element = $compile("<div console-out></div>")(scope);
        scope.dispatch("ololo");
        expect(element.html()).toEqual("ololo");
        scope.dispatch("alala");
        expect(element.html()).toEqual("ololoalala");
    });
});