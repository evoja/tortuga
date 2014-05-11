om.ns_run('trtg.tbox.ang', function(ns)
{

function ServiceProxyController(scope, service)
{
    for(var i in service)
    {
        if(angular.isFunction(service[i])) {
            scope[i] = service[i].bind(service);
        }
    }
};

ns.ServiceProxyController = ServiceProxyController;
});
