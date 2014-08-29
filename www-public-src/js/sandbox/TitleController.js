om.ns_run('sandbox', function(ns){
    ns.TitleController = function()
    {
        this.title = 'hello!';
    };

    ns.TitleController.prototype.do_ololo = function()
    {
        return this.title + '___ololo';
    };
});