om.ns_run('sandbox', function(ns){
    ns.LessonService = function(location_service, lessons_structure, $scope)
    {
        this.location_service_ = location_service;
        this.lessons_structure_ = lessons_structure;
    };

    ns.LessonService.prototype.get_name = function()
    {
        return get_lesson_data(this).name;
    };



//=========================================================
    var get_lesson_data = function(lessons_service)
    {
        var lessons_structure = lessons_service.lessons_structure_;
        var lesson_id = lessons_service.location_service_.get_path_pairs_map().lessons;
        return lessons_structure[lesson_id];
    };
});
