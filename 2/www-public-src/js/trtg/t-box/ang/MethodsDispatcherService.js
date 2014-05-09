Om.ns_run('Trtg.TBox.Ang', function(ns)
{

ns.MethodsDispatcherService = function MethodsDispatcherService(Block)
{
    var blocks = [];

    var create_block = function()
    {
        var obj = Object.create(Block.prototype);
        Block.apply(obj, arguments);
        return obj;
    };
    
    var result = {
        register_block : function()
        {
            var block = create_block.apply(null, arguments);
            blocks.push(block);
            return block;
        },

        unregister_block : function(block)
        {
            var index = blocks.indexOf(block);
            if(index >= 0)
            {
                blocks.splice(index, 1);
            }
        }
    };

    var dispatch = function()
    {
        var method = this;
        var args = arguments;
        var apply_to_block = function(block)
        {
            return method.apply(block, args);
        };

        if(blocks.length == 1)
        {
            return apply_to_block(blocks[0]);
        }
        else
        {
            blocks.forEach(apply_to_block);
        }
    }

    var block_prototype = Block.prototype;
    for(var i in block_prototype)
    {
        result[i] = dispatch.bind(block_prototype[i]);
    }

    return result;
};

});
