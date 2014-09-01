om.ns_run('trtg.values', function(ns){
    ns.lessons = {
        first_id : {
            title: 'Урок 1',
            tasks: [{
                    title: 'Углы',
                    description: 'Все лучи выходят из&nbsp;одной точки под одинаковыми углами друг к&nbsp;другу.<br> '
                        + 'Длина каждого лучика равна&nbsp;40.<br> '
                        + '<br> '
                        + 'Для справки:<ul> '
                        + '<li><a href="http://youtu.be/9hqxegcnNiw">Что такое углы и градусы?</a></li> '
                        + '<li><a href="http://youtu.be/nqPWQCl2ZBM">Как рисовать при помощи черепашки?</a></li> '
                        + '</ul> ',
                    definition: function() {
                        console.log('First lesson, House');
                    },
                    src: 'lessons/tortuga-01-1-angles.png'
                },{
                    title: 'Многоугольники',
                    description: 'Длина стороны большинства многоугольников равна&nbsp;40. '
                        + 'В&nbsp;двух случаях длина указана на&nbsp;рисунке и&nbsp;обозначена буквой&nbsp;L.<br> '
                        + 'Во&nbsp;всех случаях кроме одного количество углов можно посчитать самостоятельно, '
                        + 'а&nbsp;в&nbsp;особом случае количество углов указано на&nbsp;рисунке и&nbsp;обозначено за&nbsp;N.',
                    definition: function() {
                        console.log('First lesson, Village');
                    },
                    src: 'lessons/tortuga-01-2-polygons.png'
                },{
                    title: 'Домик',
                    description: 'Все изображённые отрезки одинаковы и&nbsp;равны&nbsp;200.<br> '
                        + 'Нарисуйте цветной домик поверх серого и&nbsp;на&nbsp;своё усмотрение '
                        + ' добавьте на&nbsp;картинку дополнительные элементы: окно, трубу, лавочку, дерево и&nbsp;т.&nbsp;п.',
                    src: 'lessons/tortuga-01-3-house.png'
                }
            ],
            words: ['word-1.1', 'word-1.2']
        },
        second_id : {
            title: 'Second lesson',
            tasks: [{
                    title: 'Only task',
                    description: 'This is a lesson about something',
                    definition: function() {
                        console.log('Second lesson, Only task');
                    }
                }
            ],
            words: ['word-1.1', 'word-2.1', 'word-2.2']
        }
    };
});
