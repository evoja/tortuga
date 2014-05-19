'use strict';

describe('om.func.js testing', function()
{
    var obj10;
    var obj20;
    var sum;
    var sum_obj;

    beforeEach(function()
    {
        obj10 = {x:10};
        obj20 = {x:20};
        sum = function(a, b) {return a + b;};
        sum_obj = function(a, b) {return this.x + a + b};
    });

    var test_sum = function(curry_function, name)
    {
        var fun_name = name || curry_function.name;

        it(fun_name + ': curry no context, run no context', function()
        {
            var sum5 = curry_function(sum, 5);
            expect(sum5(10)).toBe(15); // 5 + 10 == 15
        });

        it(fun_name + ': curry no context, run with context', function()
        {
            var sum5 = curry_function(sum_obj, 5);
            window.s5 = sum5;
            window.s = curry_function;
            expect(sum5.call(obj10, 10)).toBe(25); // 10 + 5 + 10 = 25
            expect(sum5.call(obj20, 10)).toBe(35); // 20 + 5 + 10 = 35
        });

        it(fun_name + ': curry witgh context, run no context', function()
        {
            var sum_10_5 = curry_function.call(obj10, sum_obj, 5);
            var sum_20_5 = curry_function.call(obj20, sum_obj, 5);

            expect(sum_10_5(10)).toEqual(NaN); // undefined + 5 + 10 = NaN
            expect(sum_20_5(10)).toEqual(NaN); // undefined + 5 + 10 = NaN
        });

        it(fun_name + ': curry with context, run with context', function()
        {
            var sum_10_5 = curry_function.call(obj10, sum_obj, 5);
            var sum_20_5 = curry_function.call(obj20, sum_obj, 5);

            expect(sum_10_5.call(obj10, 10)).toBe(25); // 10 + 5 + 10 = 25
            expect(sum_10_5.call(obj20, 10)).toBe(35); // 20 + 5 + 10 = 35
            expect(sum_20_5.call(obj10, 10)).toBe(25); // 10 + 5 + 10 = 25
            expect(sum_20_5.call(obj20, 10)).toBe(35); // 20 + 5 + 10 = 35
        });

        it(fun_name + ': curry with bind, run no context', function()
        {
            var sum_10_5 = curry_function(sum_obj.bind(obj10), 5);
            var sum_20_5 = curry_function(sum_obj.bind(obj20), 5);

            expect(sum_10_5(10)).toBe(25); // 10 + 5 + 10 = 25
            expect(sum_20_5(10)).toBe(35); // 20 + 5 + 10 = 35
        });

        it(fun_name + ': curry with bind, run with context', function()
        {
            var sum_10_5 = curry_function(sum_obj.bind(obj10), 5);
            var sum_20_5 = curry_function(sum_obj.bind(obj20), 5);

            expect(sum_10_5.call(obj10, 10)).toBe(25); // 10 + 5 + 10 = 25
            expect(sum_10_5.call(obj20, 10)).toBe(25); // 10 + 5 + 10 = 25
            expect(sum_20_5.call(obj10, 10)).toBe(35); // 20 + 5 + 10 = 35
            expect(sum_20_5.call(obj20, 10)).toBe(35); // 20 + 5 + 10 = 35
        });
    };


    var t_curry = om.ns_get("om.func.curry");
    var t_curry_l = om.ns_get("om.func.curry_l");
    var t_curry_gaps = om.ns_get("om.func.curry_gaps");
    var t_curry_gaps_right_helper = t_curry_l(t_curry_gaps, undefined);
    var t_curry_gaps_left_helper = function(fun, arg)
    {
        return t_curry_gaps(fun, undefined, arg);
    }

    describe('om.func.curry() testing', test_sum.bind(null, t_curry));
    describe('om.func.curry_l() testing', test_sum.bind(null, t_curry_l));
    describe('om.func.curry_gaps(fun, arg, undefined) testing', test_sum.bind(null, t_curry_gaps_right_helper, "curry_gaps"));
    describe('om.func.curry_gaps(fun, undefined, arg) testing', test_sum.bind(null, t_curry_gaps_left_helper, "curry_gaps"));
});