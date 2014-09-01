om.ns_run('trtg.lessons', function(ns)
{
    var curry = om.ns_get('om.func.curry');
    var TASK_SEGMENT = 'tasks';
    var LESSON_SEGMENT = 'lessons'

    ns.LessonService = function(location_service, lessons_structure, $location, $scope)
    {
        this.location_service_ = location_service;
        this.lessons_structure_ = lessons_structure;
        this.$location_ = $location;
    };

    ns.LessonService.prototype.get_lesson_data = function()
    {
        var lessons_structure = this.lessons_structure_;
        var lesson_id = this.location_service_.get_path_pairs_map().lessons;
        var lesson_data = lessons_structure[lesson_id];
        return lesson_data && lesson_data.tasks
            ? lesson_data
            : null;
    };

    ns.LessonService.prototype.get_task_num = function()
    {
        var lesson_data = this.get_lesson_data();
        var task_num = Number(this.location_service_.get_path_pairs_map()[TASK_SEGMENT]);
        return (task_num >= lesson_data.tasks.length)
            ? 0 : task_num;
    }

    ns.LessonService.prototype.get_task_url = function(task_num)
    {
        task_num = task_num !== undefined ? task_num : this.get_task_num();
        var location_service = this.location_service_;
        var $location = this.$location_;
        var path = location_service.get_path();
        var task_path = location_service.update_path_pair(path, TASK_SEGMENT, task_num);
        return location_service.update_url(task_path);
//        return '#/' + task_path + '?' + $location.search() + $location.hash();
    }

    ns.LessonService.prototype.get_task_data = function()
    {
        var lesson_data = this.get_lesson_data();
        return lesson_data
            ? lesson_data.tasks[this.get_task_num()]
            : null;
    }
});
