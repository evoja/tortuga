om.ns_run('sandbox.values', function(ns)
{
    ns.site_structure = {
        'quests': [{
                'id': 'q1',
                'name': 'Quest_1',
                'lessons': ['first_id', 'second_id'],
                'words': ['word-1.1', 'word-2.1', 'word-3']
            },{
                'id': 'q2',
                'name': 'Quest_2',
                'lessons': ['second_id']
            }
        ]
    };
});
