/**
 * Path example:
 * #/quests/q1/lessons;start=0;count=20/first_id/task/1
 */

(function() {
var ns_get = om.ns_get;
var curry = ns_get('om.func.curry');
var nsg = function(postfix){return ns_get('sandbox.' + postfix);};
//var nsg_omang = function(postfix){return ns_get('omang.' + postfix);};

angular.module('sandbox_module.submodule', [])
    .constant('log', console)
    .constant('site_structure', nsg('values.site_structure'))
    .constant('lessons_structure', nsg('values.lessons'))

    .service('location_service',
        ['$location', nsg('LocationService')])
    .service('quest_service',
        ['location_service', 'site_structure', nsg('QuestService')])
    .service('lesson_service',
        ['location_service', 'lessons_structure', nsg('LessonService')])
    .controller('TitleController',
        ['quest_service', 'lesson_service', '$scope', nsg('TitleController')])
    // .controller('TitleController2', ['service', nsg('TitleController')])
    // .directive('sbTitle', nsg('TitleDirective'))
    // .directive('sbQuest', curry(nsg('TitleDirective'), 'TitleController'))
    // .directive('sbLesson', curry(nsg('TitleDirective'), 'TitleController'))
    // .directive('sbWords', curry(nsg('TitleDirective'), 'TitleController'))
    // .service('tbox_tortoise_canvas_service',
    //             ['TBoxTortoiseCanvasBlock', tang_get('MethodsDispatcherService')])
;
angular.module('sandbox_module', ['sandbox_module.submodule']);
angular.bootstrap(document.getElementById('sandbox_module'), ['sandbox_module']);

})();
