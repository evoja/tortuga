om.ns_run('trtg.values', function(ns){
    ns.lessons = {
        first_id : {
            title: 'First lesson',
            tasks: [{
                    title: 'House',
                    description: 'This is a lesson about a house',
                    definition: function() {
                        console.log('First lesson, House');
                    }
                },{
                    title: 'Village',
                    description: 'This is a lesson about a village',
                    definition: function() {
                        console.log('First lesson, Village');
                    }
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
