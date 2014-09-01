om.ns_run('trtg.site', function(ns)
{
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
            return build_path_segments(this.get_path_parts());
        },
        get_path_pairs_map: function()
        {
            return build_segments_pairs_map(this.get_path_segments());
        },
        get_path: function()
        {
            return this.$location_.path();
        },
        update_url: function(path)
        {
            path = (path.charAt(0) === '/') ? path : '/' + path;
            var $location = this.$location_;
            return '#' + $location.url().replace($location.path(), path);
        },
        update_path_pair: function(path, key, value)
        {
            var parts = build_path_parts(path);
            var segments = build_path_segments(parts);
            var pairs = build_segments_pairs(segments);
            var pair = pairs.filter(function(pair){return pair.key === key;})[0];
            pair.value = value;
            return build_path_by_segments_pairs(pairs);
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

    var build_path_segments = function(parts)
    {
        return parts.map(function(part){return part.segment;});
    };

    var build_segments_pairs = function(segments)
    {
        var pairs = [];
        var last_elem = null;
        segments.forEach(function(elem)
        {
            if (last_elem === null)
            {
                last_elem = elem;
            }
            else
            {
                pairs.push({
                    key: last_elem,
                    value: elem
                });
                last_elem = null;
            }
        });
        return pairs;
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

    var build_path_by_segments_pairs = function(pairs)
    {
        var segments = [];
        pairs.forEach(function(pair)
        {
            segments.push(pair.key);
            segments.push(pair.value);
        });
        return segments.join('/');
    };
});