(function() {
var ns_get = om.ns_get;
var curry = ns_get('om.func.curry');

angular.module('trtg.site.footer_module', [])
    .constant('log', console)
    .constant('footer_structure', ns_get('trtg.values.site_footer_structure'))
    .controller('FooterController', ['footer_structure', function(footer_structure)
        {
            this.footer_structure = footer_structure;
        }])
;

})();
