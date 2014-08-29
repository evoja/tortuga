(function(){
var ns_get = om.ns_get;
var curry = ns_get('om.func.curry');

angular.module('sandbox_module.submodule', [])
    .value('first_value', 10)
    // .service('tbox_tortoise_canvas_service',
    //             ['TBoxTortoiseCanvasBlock', tang_get('MethodsDispatcherService')])

angular.module('sandbox_module', ['sandbox_module.submodule']);

})()