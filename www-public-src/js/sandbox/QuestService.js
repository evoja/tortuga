om.ns_run('sandbox', function(ns)
{
    ns.QuestService = function QuestService(location_service, site_structure)
    {
        this.location_service_ = location_service;
        this.site_structure_ = site_structure;
    };

    ns.QuestService.prototype.get_name = function()
    {
        return get_quest_data(this).name
    };

//==========================================================================


    var get_quest_data = function(quest_service)
    {
        var site_structure = quest_service.site_structure_;
        var quest_id = quest_service.location_service_.get_path_pairs_map().quests;
        
        return site_structure.quests.filter(function(item)
            {
                console.log(item, quest_id);
                return item.id == quest_id;
            })[0];

    };


});
