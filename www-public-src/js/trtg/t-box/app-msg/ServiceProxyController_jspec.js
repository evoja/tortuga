'use strict';

describe('DispatcherService', function()
{

    it('first', function()
    {
        var SPC = trtg.tbox.app_msg.ServiceProxyController;
        expect(SPC).toBeDefined();
        var scope = {x: 3};
        var res_x;
        var res_y;
        var res_this;
        var service = {
            a: 1, 
            b: 'hello', 
            x: 4, 
            fun: function(y)
            {
                res_x = this.x;
                res_y = y;
                res_this = this;
            }
        };

        SPC(scope, service);

        expect(scope.a).toBeUndefined();
        expect(scope.b).toBeUndefined();
        expect(typeof scope.fun).toEqual('function');
        expect(scope.x).toBe(3);

        scope.fun(5);
        expect(res_x).toBe(4);
        expect(res_y).toBe(5);
        expect(res_this).toBe(service);
        expect(res_this).not.toBe(scope);
    });
});
