/**
 * @namespace om.func
 * @memberof! <global>
*/

om.ns_run('om.func', function(ns)
{
var slice = om.ns_get('Array.prototype.slice')
var bind = om.ns_get('Function.prototype.bind')
var main_context = this;

/**
Wraps argument to function that returns its value;
@function
@memberof om.func
@param {*} arg Value that will be returned by returned function
@returns {function} function that returns arg's value
*/
var func = function(arg){return function(){return arg}}


/**
@example <caption>1. Без контекста:</caption>
        var div = function(a, b){return a / b}
        var d60 = curry(div, 60);
        d60(2) // 30
        d60(10) // 6

@example <caption>2. В контексте:</caption>
        var Koeff = function(k){this.k = k}
        Koeff.prototype.sum = function(a, b){return (a + b) * this.k}

        var koeff = new Koeff(2);
        koeff.sum(3, 4) // --> 14

        var k2sum3 = curry(koeff.sum.bind(koeff), 3) // === koeff.sum.bind(koeff, 3);
        k2sum3(4) // --> 14
        k2sum3(0) // --> 6

@example <caption>3. Ещё пример:</caption>
        var result = []
        var pushSum = function(a, b){result.push(a + b)}
        var arr = [1, 2, 3, 4]
        var const = 10

        //usual way:
        arr.forEach(function(val){pushSum(const, val))})

        //curry way:
        arr.forEach(curry(pushSum, const))

@function
@memberof om.func
@param {function} fun - Curried function
@param {...*} var_args - Partial arguments
@returns {function}
*/
function curry(fun /*, arguments */)
{
    var args1 = slice.call(arguments, 1)
    return function(/* arguments */)
    {
        return fun.apply(this, args1.concat(slice.apply(arguments)));
    }
}

/*
@example <caption>1. Без контекста</caption>
        var div = function(a, b){return a / b}
        var d5 = curry_l(div, 5);
        d5(10) // 2
        d5(60) // 12

@function
@memberof om.func
@param {function} fun - Curried function
@param {...*} args - Partial arguments
@returns {function}
*/
function curry_l(fun /* other */)
{
    var args1 = slice.call(arguments, 1)
    return function(/* arguments */)
    {
        return fun.apply(this, slice.apply(arguments).concat(args1))
    }
}

/**
@ecample <caption>1. Без контекста</caption>
        var div = function(a, b, c){return a / b + c}
        var d10_x_1 = curry_gaps(div, 10, undefined, 1);
        d10_x_1(10) // 2
        d10_x_1(2)  // 6
        d10_x_1(5)  // 3

@function
@memberof om.func
@param {function} fun - Curried function
@param {...*} args - Partial arguments with undefined as gaps
@returns {function}
*/
function curry_gaps(fun /* other */)
{
    var args = slice.call(arguments, 1)
    return function(/* arguments */)
    {
        var args_copy = slice.call(args)
        var len = args_copy.length
        var arguments_index = 0
        for(var i = 0; i < len; ++i)
        {
            if(args_copy[i] === undefined)
            {
                args_copy[i] = arguments[arguments_index]
                ++arguments_index
            }
        }

        return fun.apply(this, args_copy)
    }
}

/**
Returns function that negate result of argument function
@example
var every = function(arr, cond)
{
    return array_every.call(arr, cond)
}

var some = function(arr, cond)
{
    return !every(arr, not(cond))
}
@function
@memberof om.func.logic
@param {function} fun - Negated function
@returns {function():boolean} - Function that returns boolean
*/
var not = function(fun)
{
    return function()
    {
       return !fun.apply(this, arguments)
    }
}



ns.curry              = curry
ns.curry_l             = curry_l
ns.curryL             = curry_l
ns.curry_gaps         = curry_gaps
ns.func               = func

/**
@namespace om.func.logic
@memberof! <global>
*/
ns.logic = {
    not : not
}

});
