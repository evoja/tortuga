om.ns_run('trtg.tbox.tblocks', function(ns)
{

/**
 * Controller that proxies all methods of injected service to injected $scope.
 * @alias TortoiseCanvasController
 * @memberOf trtg.tbox.ang.tblocks
 * @param $scope
 * @param service
 */
ns.TortoiseCanvasController = function TortoiseCanvasController($scope, 
                                    tortuga_service, mouse_service, url_service,
                                    lesson_service)
{
    var context = this;
    context.tortuga_service = tortuga_service;
    context.mouse_service = mouse_service;

    $scope.$watch(function(){return lesson_service.get_task_data().src}, function()
    {
        context.background_url = lesson_service.get_task_data().src;
    });

    url_service.add_handler(function(url){
        context.background_url = url;
        $scope.$apply();
    });
};

});
