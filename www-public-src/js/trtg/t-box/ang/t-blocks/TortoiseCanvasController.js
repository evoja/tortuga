om.ns_run('trtg.tbox.ang.tblocks', function(ns)
{

/**
 * Controller that proxies all methods of injected service to injected scope.
 * @alias TortoiseCanvasController
 * @memberOf trtg.tbox.ang.tblocks
 * @param scope
 * @param service
 */
ns.TortoiseCanvasController = function TortoiseCanvasController(scope, 
                                    tortuga_service, mouse_service, url_service)
{
    scope.tortuga_service = tortuga_service;
    scope.mouse_service = mouse_service;
    scope.background_url = "";

    url_service.add_handler(function(url){
        scope.background_url = url;
        scope.$apply();
    });
};

});