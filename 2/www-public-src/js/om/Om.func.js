om.ns_run('om', function(ns)
{
var slice = om.ns_get('Array.prototype.slice')
var bind = om.ns_get('Function.prototype.bind')

/**
Wraps argument to function that returns its value;
@function
@memberof om
@param {*} arg Value that will be returned by returned function
@returns {function} function that returns arg's value
*/
var func = function(arg){return function(){return arg}}


/**
## Пример использования:
Пример использования:
1. Без контекста:
		var div = function(a, b){return a / b}
		var d60 = curry(div, 60);
		d60(2) // 30
		d60(10) // 6

2. В контексте:
		var Koeff = function(k){this.k = k}
		Koeff.prototype.sum = function(a, b){return (a + b) * this.k}

		var koeff = new Koeff(2);
		koeff.sum(3, 4) // --> 14

		var k2sum3 = curry.call(koeff, koeff.sum, 3)
		//////////// var k2sum3 = curry.apply(koeff, [koeff.sum, 3])
		k2sum3(4) // --> 14
		k2sum3(0) // --> 6

3. Ещё пример:
		var result = []
		var pushSum = function(a, b){result.push(a + b)}
		var arr = [1, 2, 3, 4]
		var const = 10

		//usual way:
		arr.forEach(function(val){pushSum(const, val))})

		//curry way:
		arr.forEach(curry(pushSum, const))

@function
@memberof om
@param {function} fun - Curried function
@param {...*} args - Partial arguments
@returns {function}
*/
var curry = function(fun /*, arguments */)
{
	var scope = this
	var args1 = slice.call(arguments, 1)
	return function(/* arguments */)
	{
		return fun.apply(scope, args1.concat(slice.apply(arguments)));
	}
}

var curry_through_bind = function(fun /*, arguments */)
{
	arguments[0] = this
	return bind.apply(fun, arguments)
}

/*
## Пример использования:
1. Без контекста
		var div = function(a, b){return a / b}
		var d5 = curryL(div, 5);
		d5(10) // 2
		d5(60) // 12

@function
@memberof om
@param {function} fun - Curried function
@param {...*} args - Partial arguments
@returns {function}
*/
var curryL = function(fun /* other */)
{
	var scope = this
	var args1 = slice.call(arguments, 1)
	return function(/* arguments */)
	{
		return fun.apply(scope, slice.apply(arguments).concat(args1))
	}
}

/**
## Пример использования:
1. Без контекста
		var div = function(a, b, c){return a / b + c}
		var d10_x_1 = curry_gaps(div, 10, undefined, 1);
		d10_x_1(10) // 2
		d10_x_1(2)  // 6
		d10_x_1(5)  // 3

@function
@memberof om
@param {function} fun - Curried function
@param {...*} args - Partial arguments with undefined as gaps
@returns {function}
*/
var curry_gaps = function(fun /* other */)
{
	var scope = this
	var args1 = slice.call(arguments, 1)
	return function(/* arguments */)
	{
		var args2 = slice.call(args1)
		var len = args2.length
		var arguments_index = 0
		for(var i = 0; i < len; ++i)
		{
			if(args2[i] === undefined)
			{
				args2[i] = arguments[arguments_index]
				++arguments_index
			}
		}

		return fun.apply(scope, args2)
	}
}

/**
Returns function that negate result of argument function
@function
@memberof om
@param {function} fun - Negated function
@returns {function} - Function that returns boolean
*/
var not = function(fun)
{
	return function()
	{
		return !fun.apply(this, arguments)
	}
}



ns.curry              = curry
ns.curryL             = curryL
ns.curry_through_bind = curry_through_bind
ns.curry_gaps         = curry_gaps
ns.func               = func

ns.logic = {
	not : not
}

});
