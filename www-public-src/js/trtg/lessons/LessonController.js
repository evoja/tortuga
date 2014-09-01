om.ns_run('trtg.lessons', function(ns)
{
    var curry = om.ns_get('om.func.curry');
    var htmlspecialchars = om.ns_get("om.text.htmlspecialchars");

    ns.LessonController = function(location_service, lesson_service, $sce, $scope)
    {
        var controller = this;
        $scope.$on('$locationChangeSuccess', function() {
            var lesson_data = lesson_service.get_lesson_data();
            var task_data = lesson_service.get_task_data();
            
            if (!lesson_data || !task_data)
            {
                controller.has_lesson = false;
                controller.task_data = null;
                controller.tasks_titles = [];
                return true;
            }

            controller.has_lesson = true;
            controller.task_data = task_data;
            controller.task_num = lesson_service.get_task_num();

            var safe_description = htmlspecialchars(task_data.description);
            safe_description = repairTags(repairLinks(safe_description));
            controller.task_description = $sce.trustAsHtml(safe_description);

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



    var repairLinks = function (text)
    {
        var answer = '<a href="$1">$2</a>';
        var f = '&lt;a href=';
        var m1 = '&quot;(.*?)&quot;';
        var m2 = '&#039;(.*?)&#039;';
        var l = '&gt;(.*?)&lt;/a&gt;';
        var r1 = new RegExp(f + m1 + l, 'gi');
        var r2 = new RegExp(f + m2 + l, 'gi');
        return text.replace(r1, answer).replace(r2, answer);
    };

    var repairTags = function (text)
    {
        var tags = [
            ['br', '<br/>'],
            ['br/', '<br/>'],
            'p', 'b', 'i', 'u', 'ul', 'li',
            '&nbsp;', '&mdash;'
        ];
        var lt = '&lt;';
        var gt = '&gt;';

        replaces = [];
        tags.forEach(function(elem)
        {
            if (typeof elem !== 'string')
            {
                replaces.push([lt + elem[0] + gt, elem[1]]);
            }
            else if (elem.charAt(0) === '&')
            {
                replaces.push(['&amp;' + elem.substring(1), elem]);
            }
            else
            {
                replaces.push([ lt+elem+gt, '<'+elem+'>']);
                replaces.push([ lt+'/'+elem+gt, '</'+elem+'>']);
            }
        });

        replaces.forEach(function(elem)
        {
            text = text.replace(new RegExp(elem[0], 'gi'), elem[1]);
        });
        return text;
    };
});