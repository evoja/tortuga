(function() {
var ns_get = om.ns_get;
var curry = ns_get('om.func.curry');

angular.module('trtg.lessons.lessons_module', ['trtg.site.site_module'])
    .constant('lessons_structure', ns_get('trtg.values.lessons'))

    .service('lesson_service',
        [
            'location_service',
            'lessons_structure',
            '$location',
            ns_get('trtg.lessons.LessonService')
        ])

    .controller('LessonController',
        [
            'location_service',
            'lesson_service',
            '$sce',
            '$scope',
            ns_get('trtg.lessons.LessonController')
        ])
;

})();
