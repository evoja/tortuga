'use strict';

describe('DispatcherController', function()
{
    var scope;

    beforeEach(module('t_box_module'));

    // injection du service $controller et du $rootScope, 
    // attention l'identification du service se fait sur son nom
    // il faut bien respecter $controller et pas écrire $controleur
    beforeEach(inject(function($controller, $rootScope) {
        // creation du controller avec le nouveau scope
        scope = $rootScope.$new();
        var controller = $controller("DispatcherController", {
            $scope: scope
        });
    }));

    it('test dispatches', function()
    {
        var str;
        var handler = function(value){str = value;};
        scope.add_handler(handler);
        scope.dispatch("hello");
        expect(str).toEqual("hello");
        scope.remove_handler(handler);
        scope.dispatch("ololo");
        expect(str).not.toEqual("ololo");
    });
});