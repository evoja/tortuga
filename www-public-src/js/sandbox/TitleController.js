om.ns_run('sandbox', function(ns)
{
    ns.TitleController = function(quest_service, lesson_service, $scope)
    {
        this.quest_service_ = quest_service;
        this.lesson_service_ = lesson_service;

        $scope.$on('$locationChangeSuccess', curry(on_location_change_success, this));
    };


//=====================================================================
    var curry = om.ns_get('om.func.curry');

    var on_location_change_success = function(controller, event)
    {
        var quest_name = controller.quest_service_.get_name();
        var lesson_name = controller.lesson_service_.get_name();
        controller.text = lesson_name + ' \\ ' + quest_name;
    };
});
