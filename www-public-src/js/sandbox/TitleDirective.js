om.ns_run('sandbox', function(ns)
{
    ns.TitleDirective = function()
    {
        return {
            template: '<h1>{{title}}</h1'
        };
    }
})