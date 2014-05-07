Om.ns("Trtg.TBox.Ang");

(function()
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

Trtg.TBox.Ang.ServiceProxyController = ServiceProxyController;
})();
