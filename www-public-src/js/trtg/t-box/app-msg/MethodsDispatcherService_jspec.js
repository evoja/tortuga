'use strict';

describe('MethodsDispatcherService', function()
{
    var TestBlock = function(name, callback)
    {
        this.name = name;
        this.callback = callback;
    };
    TestBlock.prototype.assign_arguments = function()
    {
        this.last_arguments = Array.prototype.slice.call(arguments, 0);
    };
    TestBlock.prototype.call_callback = function()
    {
        return this.callback.apply(this, arguments);
    };
    TestBlock.prototype.log = function()
    {
        console.log.apply(console, arguments);
    };

    angular.module('test_module', [])
        .value('TestBlock', TestBlock)
        .service('service', ['TestBlock', om.ns_get("trtg.tbox.app_msg.MethodsDispatcherService")]);



    beforeEach(module('test_module'));

    it('test', inject(function(service)
    {
        expect(service).toBeDefined();
        expect(service).not.toBeNull();
        var block = service.register_block('hello', function(value) {
            this.value = value;
        });
        
        expect(block.name).toEqual('hello');

        expect(block.last_arguments).toBeUndefined();
        service.assign_arguments('world', 'ololorld');
        expect(block.last_arguments).toBeDefined();
        expect(block.last_arguments.length).toBe(2);
        expect(block.last_arguments[0]).toEqual('world');
        expect(block.last_arguments[1]).toEqual('ololorld');

        expect(block.value).toBeUndefined();
        service.call_callback(1);
        expect(block.value).toBe(1);
        service.call_callback(2);
        expect(block.value).toBe(2);

        service.unregister_block(block);
        service.call_callback(3);
        expect(block.value).toBe(2);
    }));

    it('Test returns from one handler', inject(function(service)
    {
        var handler = function(value){return value + '1';};
        var block = service.register_block('first', handler);
        var result = service.call_callback('hello');
        expect(result).toEqual('hello1');
        service.unregister_block(block);
        var result1 = service.call_callback('hello');
        expect(result1).toBeUndefined();
    }));

    it('Test doesnt return from more than one handler', inject(function(service)
    {
        var handler = function(value){return value + this.name;};

        var block1 = service.register_block('first', handler);
        expect(service.call_callback('hello ')).toEqual('hello first');

        var block2 = service.register_block('second', handler);
        expect(service.call_callback('hello')).toBeUndefined();

        service.unregister_block(block1);
        expect(service.call_callback('hello ')).toEqual('hello second');

        service.unregister_block(block2);
        expect(service.call_callback('hello')).toBeUndefined();
    }));
});