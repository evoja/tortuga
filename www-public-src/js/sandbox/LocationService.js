om.ns_run('sandbox', function(ns)
{
//==== public ========================================
    ns.LocationService = function($location)
    {
        this.$location_ = $location;
    };

    ns.LocationService.prototype = {
        get_path_parts: function()
        {
            return build_path_parts(this.$location_.path());
        },
        get_path_segments: function()
        {
            return this.get_path_parts().map(function(part){return part.segment;});
        },
        get_path_pairs_map: function()
        {
            return build_segments_pairs_map(this.get_path_segments());
        }
    };

//=====================================================
    var build_url_part_obj = function(string)
    {
        var elems_strings = string.split(';');
        var segment = elems_strings.shift();
        var parameters = {};
        var parameters_count = 0;
        elems_strings.forEach(function(elem)
        {
            var parse = /^(\w+)=(.*)$/.exec(elem);
            if (parse)
            {
                parameters[parse[1]] = parse[2];
                ++parameters_count;
            }
        });
        return {
            segment: segment,
            parameters: parameters,
            parameters_count: parameters_count
        };
    }

    var build_path_parts = function(string)
    {
        var parts = string.split('/');
        return parts
            .filter(function(elem){return !!elem;})
            .map(build_url_part_obj);
    };

    var build_segments_pairs_map = function(segments)
    {
        var pairs = {};
        var last_elem = null;
        segments.forEach(function(elem)
        {
            if (last_elem === null)
            {
                last_elem = elem;
            }
            else
            {
                pairs[last_elem] = elem;
                last_elem = null;
            }
        });
        return pairs;
    };
});