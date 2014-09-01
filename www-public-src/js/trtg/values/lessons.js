om.ns_run('trtg.values', function(ns){
    ns.lessons = {
        first_id : {
            name: 'First lesson',
            tasks: [{
                    name: 'House',
                    definition: function() {
                        console.log('First lesson, House');
                    }
                },{
                    name: 'Village',
                    definition: function() {
                        console.log('First lesson, Village');
                    }
                }
            ],
            words: ['word-1.1', 'word-1.2']
        },
        second_id : {
            name: 'Second lesson',
            tasks: [{
                    name: 'Only task',
                    definition: function() {
                        console.log('Second lesson, Only task');
                    }
                }
            ],
            words: ['word-1.1', 'word-2.1', 'word-2.2']
        }
    };
});
