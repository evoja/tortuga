(function() {
var ns_get = om.ns_get;
var curry = ns_get('om.func.curry');

angular.module('trtg.site.site_module', [])
    .service('location_service',
        ['$location', ns_get('trtg.site.LocationService')])
;

})();
