om.ns_run('trtg.values', function(ns){
    ns.site_footer_structure = {
        columns : [
            ['js/trtg/values/footer_authors.data.html'],
            ['js/trtg/values/footer_lessons.data.html', 'js/trtg/values/footer_recepies.data.html'],
            ['js/trtg/values/footer_project.data.html', 'js/trtg/values/footer_mirrors.data.html'],
            ['js/trtg/values/footer_similar.data.html']
        ]
    };
});
