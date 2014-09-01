om.ns_run('trtg.lessons', function(ns)
{
    var curry = om.ns_get('om.func.curry');

    ns.LessonController = function(location_service, lesson_service, $scope)
    {
        var controller = this;
        $scope.$on('$locationChangeSuccess', function() {
            var lesson_data = lesson_service.get_lesson_data();
            var task_data = lesson_service.get_task_data();
            
            if (!lesson_data || !task_data)
            {
                controller.active = false;
                controller.task_data = null;
                controller.tasks_titles = [];
                return;
            }

            controller.has_lesson = true;
            controller.task_data = task_data;
            controller.task_num = lesson_service.get_task_num();

            var index = 0;
            controller.tasks = lesson_data.tasks.map(function(task)
                {
                    return {
                        title: task.title,
                        is_current: index == controller.task_num,
                        url: lesson_service.get_task_url(index++),
                    };
                });
        });
    };
});