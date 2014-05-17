om.ns_run('trtg.tbox.app_msg', function(ns)
{
/**
 * AngularJS service creates handlers and dispatches messages to registered handlers.
 * Messages are method calls.
 * @constructor
 * @memberOf  trtg.tbox.app_msg
 * @alias MethodsDispatcherService
 * @param {function} Block - Constructor. Its prototype definces methods to call.
 * Itself is used for creating handlers instances.
 */
ns.MethodsDispatcherService = function MethodsDispatcherService(Block)
{
    var blocks = [];

    var create_block = function(var_args)
    {
        var obj = Object.create(Block.prototype);
        Block.apply(obj, arguments);
        return obj;
    };

    var result = {
        /**
         * Creates and registers messages receiver.
         * @method
         * @instance
         * @memberOf trtg.tbox.app_msg.MethodsDispatcherService
         * @param {...*} - Arguments of injected constructor to create handler instance
         * @returns {Block} handler
         */
        register_block : function()
        {
            var block = create_block.apply(null, arguments);
            blocks.push(block);
            return block;
        },

        /**
         * Unregisters messages receiver.
         * @method
         * @instance
         * @memberOf trtg.tbox.app_msg.MethodsDispatcherService
         * @param {Block} block - handler instance that should be removed
         */
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
