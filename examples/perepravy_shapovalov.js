(function()
{


//==========================================================================

//------- Core logic ---------

//==========================================================================


// CI means index
var CI_TYPE = 0
var CI_FAMILY = 1

var slice = Array.prototype.slice
var bind = Function.prototype.bind

var test_count = 0

var log = function (arg) {
    var toPrint = [];
    for (var i = 0; i < arguments.length; ++i) {
        toPrint.push(arguments[i]);
    }

    function getErrorObject(){
        try { throw Error('') } catch(err) { return err; }
    }

    var err = getErrorObject(),
        caller;

    caller = err.stack.split("\n")[5];

    var index = caller.indexOf('.js');

    var str = caller.substr(0, index + 3);
    index = str.lastIndexOf('/');
    str = str.substr(index + 1, str.length);

    var info = "\t\tFile: " + str;

    index = caller.lastIndexOf(':');
    str = caller.substr(0, index);
    index = str.lastIndexOf(':');
    str = str.substr(index + 1, str.length);
    info += " Line: " + str;
    toPrint.push(info);

    console.log.apply(console, toPrint);
}


var assert = function(bool, message)
{
	if(!bool)
	{
		message = typeof message == "function" ? message() : message
		log("Test #" + test_count + " failed: ", message)
	}
	++test_count
}

var map = function(arr, fun)
{
	var result = []
	var arr_len = arr.length
	for(var i = 0; i < arr_len; ++i)
	{
		result.push(fun(arr[i], i))
	}
	return result
}

var every = function(arr, fun)
{
	return arr.every(fun)
}

var exists = function(arr, fun)
{
	return !arr.every(not(fun))
}

var count = function(arr, fun)
{
	var sum = 0
	arr.forEach(function(elem)
		{
			sum += Number(Boolean(fun(elem)))
		})
	return sum
}

var true_fun = function(){return true}

var and = function and(fun1, fun2)
{
	var rest_of_args = slice.call(arguments, 1)
	return function()
	{
		return fun1.apply(null, arguments)
			&& (rest_of_args.length <= 0
				|| and.apply(null, rest_of_args).apply(null, arguments))
	}
};

(function test_and(){
	var more3 = function(x){return x > 3}
	var less7 = function(x){return x < 7}
	var more_less = and(more3, less7)
	assert(more_less(4), "3 < 4 < 7")
	assert(more_less(5), "3 < 5 < 7")
	assert(more_less(6), "3 < 6 < 7")
	assert(!more_less(3), "3 < 3 < 7!!!")
	assert(!more_less(7), "3 < 7 < 7!!!")

	var odd = function(x){return x % 2 == 1}
	var more_less_odd = and(more3, less7, odd)
	assert(more_less_odd(5), "5 is odd")
	assert(!more_less_odd(4), "4 is even")
})()

var or = function or(fun1, fun2) // arguments <- funs 
{
	var rest_of_args = slice.call(arguments, 1)
	return function()
	{
		return fun1.apply(null, arguments)
			|| (rest_of_args.length > 0
				&& or.apply(null, rest_of_args).apply(null, arguments))
	}
};

(function test_or(){
	var more6 = function(x){return x > 6}
	var less4 = function(x){return x < 4}
	var more_less = or(more6, less4)
	assert(!more_less(4), "3 < 4 < 7")
	assert(!more_less(5), "3 < 5 < 7")
	assert(!more_less(6), "3 < 6 < 7")
	assert(more_less(3), "3 < 3 < 7!!!")
	assert(more_less(7), "3 < 7 < 7!!!")

	var odd = function(x){return x % 2 == 1}
	var more_less_odd = or(more6, less4, odd)
	assert(more_less_odd(5), "5 is odd")
	assert(!more_less_odd(4), "4 is even")
})()

var not = function(fun)
{
	return function()
	{
		return !fun.apply(null, arguments)
	}
};

(function test_not_and_true_fun(){
	var more3 = function(x){return x > 3}
	var less7 = function(x){return x < 7}
	var more6 = function(x){return x > 6}
	var less4 = function(x){return x < 4}
	var more_and_less = and(more3, less7)
	var more_or_less = or(more6, less4)
	assert(!not(more3)(4), "!(3 < 4)")
	assert(not(less7)(7), "!(7 < 7)")
	assert(not(more_or_less)(6), "!(3 > 6 > 7)")
	assert(not(more_and_less)(3), "!(3 < 3 < 7)")
	assert(not(more_and_less)(7), "!(3 < 7 < 7)")
	assert(true_fun(), "true_fun() always returns true")
	assert(true_fun(4), "true_fun() always returns true")
	assert(true_fun(4, 6, 3, 5), "true_fun() always returns true")
})()

var curry = function(fun /*, arguments */)
{
	var scope = this
	var args1 = slice.call(arguments, 1)
	return function(/* arguments */)
	{
		return fun.apply(scope, args1.concat(slice.apply(arguments)));
	}
}

var is_family_defined = function(obj)
{
	return obj[CI_FAMILY] !== undefined;
}

var compare_families = function(first, second)
{
	return first[CI_FAMILY] - second[CI_FAMILY]
}

var are_equal_families = function(first, second)
{
	return first[CI_FAMILY] == second[CI_FAMILY]
};

(function test_are_equal_families(){
	assert(are_equal_families(["volk", 0], ["koza", 0]), "0 == 0")
	assert(!are_equal_families(["volk", 0], ["volk", 1]), "0 != 1")
})()

var are_equal_types = function(first, second)
{
	return first[CI_TYPE] == second[CI_TYPE]
};

(function test_are_equal_types(){
	assert(are_equal_types(["volk", 0], ["volk", 1]), "volk == volk")
	assert(!are_equal_types(["volk", 0], ["koza", 0]), "volk != koza")
})()

var has_object = function(arr, obj)
{
	return !arr.every(curry(not(are_equal_types), obj))
};

(function test_has_object(){
	var one = [["volk", 0], ["koza", 1], ["volk", 1], ["kapusta", 0], ["muzhik", 1], ["kapusta", 0]]
	assert(has_object(one, ["volk"]), "There are volk")
	assert(has_object(one, ["koza"]), "There are koza")
	assert(has_object(one, ["kapusta"]), "There are kapusta")
	assert(has_object(one, ["muzhik"]), "There are muzhik")
	assert(!has_object(one, ["korova"]), "There are not korova")
})()

var has_at_least_numbers_of_objects = function(arr, obj, num)
{
	var len = arr.length
	for(var i = 0; i < len; ++i)
	{
		if(are_equal_types(arr[i], obj))
		{
			--num
		}
		if(num == 0)
		{
			return true;
		}
	}
	
	// if there are no elements and num == 0 at start we must return true.
	return num == 0;
};

(function test_has_at_least_numbers_of_objects(){
	var one = [["volk", 0], ["koza", 1], ["volk", 1], ["kapusta", 0], ["muzhik", 1], ["kapusta", 0]]
	assert(has_at_least_numbers_of_objects([], ["volk"], 0), "There are 0 volks")
	assert(has_at_least_numbers_of_objects(one, ["volk"], 2), "There are 2 volks")
	assert(has_at_least_numbers_of_objects(one, ["koza"], 1), "There are 1 koza")
	assert(has_at_least_numbers_of_objects(one, ["kapusta"], 1), "There are 2 kapustas")
	assert(!has_at_least_numbers_of_objects(one, ["muzhik"], 2), "There are 1 muzhik")
	assert(!has_at_least_numbers_of_objects(one, ["korova"], 1), "There are not korova")
	assert(has_at_least_numbers_of_objects(one, ["korova"], 0), "There are not korova")
	assert(!has_at_least_numbers_of_objects(one, ["volk"], 3), "There are 2 volks")
})()

var pair_corresponds = function(obj1, obj2, mask1, mask2)
{
	if(obj1 === obj2
		|| !are_equal_types(obj1, mask1)
		|| !are_equal_types(obj2, mask2))
	{
		return false
	}

	return !is_family_defined(mask1) || !is_family_defined(mask2)
		|| !(are_equal_families(obj1, obj2) ^ are_equal_families(mask1, mask2))
};

(function test_pair_corresponds(){
	var f = function(family){return ["f",family]}
	var m = function(family){return ["m",family]}

	var f_i = f("i")
	var f_j = f("j")
	var m_i = m("i")
	var m_j = m("j")

	var f_1 = f(1)
	var f_2 = f(2)
	var f_11 = f(1)
	var m_1 = m(1)
	var m_2 = m(2)
	assert(pair_corresponds(f_1, f_2, f_i, f_j), "corresponds")
	assert(pair_corresponds(f_1, f_11, f_i, f_i), "corresponds")
	assert(!pair_corresponds(f_1, f_1, f_i, f_i), "doesn't correspond. 'f' is the same")
	assert(!pair_corresponds(m_1, m_2, f_i, f_j), "doesn't correspond")
	assert(pair_corresponds(f_1, m_2, f_i, m_j), "corresponds")
	assert(pair_corresponds(f_1, m_1, f_i, m_i), "corresponds")
})()

var has_pair_of_checked_families = function(arr, first, second, family_checker)
{
	var first_compat = arr.filter(curry(are_equal_types, first))
	var second_compat = arr.filter(curry(are_equal_types, second))

	var first_length = first_compat.length
	var second_length = second_compat.length

	for(var i = 0; i < first_length; ++i)
	{
		var f = first_compat[i]
		for(var j = 0; j < second_length; ++j)
		{
			var s = second_compat[j]
			if(family_checker(f, s) && f != s)
			{
				return true;
			}
		}
	}
};

var has_pair_one_family = function(arr, first, second)
{
	return has_pair_of_checked_families(arr, first, second, are_equal_families)
}

var has_pair_different_families = function(arr, first, second)
{
	return has_pair_of_checked_families(arr, first, second, not(are_equal_families))
}

var has_pair_any_family = function(arr, first, second)
{
	return has_pair_of_checked_families(arr, first, second, true_fun)
}

var has_pair = function(arr, first, second)
{
	return !is_family_defined(second) ? has_pair_any_family(arr, first, second)
		: are_equal_families(first, second) ? has_pair_one_family(arr, first, second)
		: has_pair_different_families(arr, first, second)
};

(function test_has_pair_functions(){
	var one = [["volk", 0], ["koza", 1], ["volk", 1], ["kapusta", 0], ["muzhik", 1], ["kapusta", 0]]
	assert(has_pair_one_family(one, ["volk"], ["koza"]), one + " has volk & koza of family 1")
	assert(has_pair_one_family(one, ["volk"], ["kapusta"]), one + " has volk & kapusta of family 0")
	assert(has_pair_one_family(one, ["kapusta"], ["kapusta"]), one + " has two kapustas of family 0")
	assert(!has_pair_one_family(one, ["koza"], ["kapusta"]), one + " hasn't koza & kapusta of same family")
	assert(!has_pair_one_family(one, ["volk"], ["volk"]), one + " hasn't two volks of same family")
	assert(!has_pair_one_family(one, ["koza"], ["koza"]), one + " hasn't two kozas of same family")

	assert(has_pair_different_families(one, ["volk"], ["koza"]), one + " has volk & koza of different families")
	assert(has_pair_different_families(one, ["volk"], ["kapusta"]), one + " has volk & kapusta of different families")
	assert(has_pair_different_families(one, ["koza"], ["kapusta"]), one + " has koza & kapusta of different families")
	assert(has_pair_different_families(one, ["volk"], ["volk"]), one + " hasn two volks of different families")
	assert(!has_pair_different_families(one, ["muzhik"], ["koza"]), one + " hasn't muzhik & koza of different families")
	assert(!has_pair_different_families(one, ["kapusta"], ["kapusta"]), one + " hasn't two kapustas of different families")
	assert(!has_pair_different_families(one, ["koza"], ["koza"]), one + " hasn't two kozas of different families")

	assert(has_pair_any_family(one, ["volk"], ["koza"]), one + " has volk & koza")
	assert(has_pair_any_family(one, ["volk"], ["kapusta"]), one + " has volk & kapusta")
	assert(has_pair_any_family(one, ["kapusta"], ["kapusta"]), one + " has two kapustas")
	assert(has_pair_any_family(one, ["koza"], ["kapusta"]), one + " has koza & kapusta")
	assert(has_pair_any_family(one, ["volk"], ["volk"]), one + " has two volks of same family")
	assert(!has_pair_any_family(one, ["koza"], ["koza"]), one + " hasn't two kozas")
	assert(!has_pair_any_family(one, ["koza"], ["korova"]), one + " hasn't korova")

	assert(has_pair(one, ["volk", "i"], ["koza", "i"]), one + " has volk & koza of family 1")
	assert(has_pair(one, ["volk", "i"], ["kapusta", "i"]), one + " has volk & kapusta of family 2")
	assert(has_pair(one, ["kapusta", "i"], ["kapusta", "i"]), one + " has two kapustas of family 2")
	assert(!has_pair(one, ["koza", "i"], ["kapusta", "i"]), one + " hasn't koza & kapusta of same family")
	assert(!has_pair(one, ["volk", "i"], ["volk", "i"]), one + " hasn't two volks of same family")
	assert(!has_pair(one, ["koza", "i"], ["koza", "i"]), one + " hasn't two kozas of same family")

	assert(has_pair(one, ["volk", "i"], ["koza", "j"]), one + " has volk & koza of different families")
	assert(has_pair(one, ["volk", "i"], ["kapusta", "j"]), one + " has volk & kapusta of different families")
	assert(has_pair(one, ["koza", "i"], ["kapusta", "j"]), one + " has koza & kapusta of different families")
	assert(has_pair(one, ["volk", "i"], ["volk", "j"]), one + " hasn two volks of different families")
	assert(!has_pair(one, ["muzhik", "i"], ["koza", "j"]), one + " hasn't muzhik & koza of different families")
	assert(!has_pair(one, ["kapusta", "i"], ["kapusta", "j"]), one + " hasn't two kapustas of different families")
	assert(!has_pair(one, ["koza", "i"], ["koza", "j"]), one + " hasn't two kozas of different families")

	assert(has_pair(one, ["volk", "i"], ["koza"]), one + " has volk & koza")
	assert(has_pair(one, ["volk", "i"], ["kapusta"]), one + " has volk & kapusta")
	assert(has_pair(one, ["kapusta"], ["kapusta"]), one + " has two kapustas")
	assert(has_pair(one, ["koza"], ["kapusta"]), one + " has koza & kapusta")
	assert(has_pair(one, ["volk", "i"], ["volk"]), one + " has two volks of same family")
	assert(!has_pair(one, ["koza", "i"], ["koza"]), one + " hasn't two kozas")
	assert(!has_pair(one, ["koza"], ["korova"]), one + " hasn't korova")

})()

var has_object_without_pair_of_checked_families = function(arr, first, second, family_checker)
{
	var first_compat = arr.filter(curry(are_equal_types, first))
	var second_compat = arr.filter(curry(are_equal_types, second))

	var first_length = first_compat.length
	var second_length = second_compat.length

	for(var i = 0; i < first_length; ++i)
	{
		var f = first_compat[i]
		var contains = false;
		for(var j = 0; j < second_length; ++j)
		{
			var s = second_compat[j]
			if(family_checker(f, s) && f != s)
			{
				contains = true;
				break;
			}
		}

		if(!contains)
		{
			return true;
		}
	}

	return false
};

var has_object_without_pair_of_one_family = function(arr, first, second)
{
	return has_object_without_pair_of_checked_families(
		arr, first, second, are_equal_families)
};

var has_object_without_pair_of_any_family = function(arr, first, second)
{
	return has_object_without_pair_of_checked_families(
		arr, first, second, true_fun)
}

var has_object_without_pair_of_different_families = function(arr, first, second)
{
	return has_object_without_pair_of_checked_families(
		arr, first, second, not(are_equal_families))
};

var has_object_without_pair = function(arr, first, second)
{
	return (! is_family_defined(second))
		? has_object_without_pair_of_any_family(arr, first, second)
		: are_equal_families(first, second)
			? has_object_without_pair_of_one_family(arr, first, second)
			: has_object_without_pair_of_different_families(arr, first, second)
};

(function test_has_object_without_pair_punctions(){
	var one = [["volk", 0], ["koza", 1], ["volk", 1], ["kapusta", 0], ["muzhik", 1], ["kapusta", 0]]
	assert(has_object_without_pair_of_one_family(one, ["volk"], ["koza"]), one + " has volk-0 without koza-0")
	assert(!has_object_without_pair_of_one_family(one, ["koza"], ["volk"]), one + " has volk-1 for koza-1")
	assert(has_object_without_pair_of_one_family(one, ["volk"], ["kapusta"]), one + " has volk-1 without kapusta-1")
	assert(!has_object_without_pair_of_one_family(one, ["kapusta"], ["kapusta"]), one + " has two kapustas of family 0")
	assert(!has_object_without_pair_of_one_family(one, ["koza"], ["muzhik"]), one + " has muzhik-1 and koza-1")
	assert(has_object_without_pair_of_one_family(one, ["koza"], ["kapusta"]), one + " hasn't koza & kapusta of same family")
	assert(has_object_without_pair_of_one_family(one, ["volk"], ["volk"]), one + " hasn't two volks of same family")
	assert(has_object_without_pair_of_one_family(one, ["koza"], ["koza"]), one + " hasn't two kozas of same family")

	assert(!has_object_without_pair_of_any_family(one, ["volk"], ["koza"]), one + " has volk & koza")
	assert(!has_object_without_pair_of_any_family(one, ["koza"], ["volk"]), one + " has volk & koza")
	assert(!has_object_without_pair_of_any_family(one, ["volk"], ["kapusta"]), one + " has volk & kapusta")
	assert(!has_object_without_pair_of_any_family(one, ["kapusta"], ["kapusta"]), one + " has two kapustas")
	assert(!has_object_without_pair_of_any_family(one, ["koza"], ["muzhik"]), one + " has muzhik-1 and koza-1")
	assert(!has_object_without_pair_of_any_family(one, ["koza"], ["kapusta"]), one + " has koza & kapusta")
	assert(!has_object_without_pair_of_any_family(one, ["volk"], ["volk"]), one + " hasn't two volks")
	assert(has_object_without_pair_of_any_family(one, ["koza"], ["koza"]), one + " hasn't two kozas")
	assert(has_object_without_pair_of_any_family(one, ["koza"], ["korova"]), one + " hasn't korova for koza")

	assert(has_object_without_pair_of_different_families(one,
		["volk"], ["koza"]), one + " has volk-1 without koza-0")
	assert(!has_object_without_pair_of_different_families(one,
		["koza"], ["volk"]), one + " has volk-0 for koza-1")
	assert(has_object_without_pair_of_different_families(one,
		["volk"], ["kapusta"]), one + " has volk-0 without kapusta-1")
	assert(!has_object_without_pair_of_different_families(one,
		["koza"], ["kapusta"]), one + " has koza & kapusta of different families")
	assert(!has_object_without_pair_of_different_families(one,
		["kapusta"], ["koza"]), one + " has koza & kapusta of different families")
	assert(!has_object_without_pair_of_different_families(one,
		["volk"], ["volk"]), one + " hasn two volks of different families")
	assert(has_object_without_pair_of_different_families(one,
		["muzhik"], ["koza"]), one + " hasn't muzhik & koza of different families")
	assert(has_object_without_pair_of_different_families(one,
		["kapusta"], ["kapusta"]), one + " hasn't two kapustas of different families")
	assert(has_object_without_pair_of_different_families(one,
		["koza"], ["koza"]), one + " hasn't two kozas of different families")


	assert(has_object_without_pair(one, ["volk", "i"], ["koza", "i"]), one + " has volk-0 without koza-0")
	assert(!has_object_without_pair(one, ["koza", "i"], ["volk", "i"]), one + " has volk-1 for koza-1")
	assert(has_object_without_pair(one, ["volk", "i"], ["kapusta", "i"]), one + " has volk-1 without kapusta-1")
	assert(!has_object_without_pair(one, ["kapusta", "i"], ["kapusta", "i"]), one + " has two kapustas of family 0")
	assert(!has_object_without_pair(one, ["koza", "i"], ["muzhik", "i"]), one + " has muzhik-1 and koza-1")
	assert(has_object_without_pair(one, ["koza", "i"], ["kapusta", "i"]), one + " hasn't koza & kapusta of same family")
	assert(has_object_without_pair(one, ["volk", "i"], ["volk", "i"]), one + " hasn't two volks of same family")
	assert(has_object_without_pair(one, ["koza", "i"], ["koza", "i"]), one + " hasn't two kozas of same family")

	assert(has_object_without_pair(one, ["volk", "i"], ["koza", "j"]), one + " has volk-1 without koza-0")
	assert(!has_object_without_pair(one, ["koza", "i"], ["volk", "j"]), one + " has volk-0 for koza-1")
	assert(has_object_without_pair(one, ["volk", "i"], ["kapusta", "j"]), one + " has volk-0 without kapusta-1")
	assert(!has_object_without_pair(one, ["koza", "i"], ["kapusta", "j"]), one + " has koza & kapusta of different families")
	assert(!has_object_without_pair(one, ["kapusta", "i"], ["koza", "j"]), one + " has koza & kapusta of different families")
	assert(!has_object_without_pair(one, ["volk", "i"], ["volk", "j"]), one + " hasn two volks of different families")
	assert(has_object_without_pair(one, ["muzhik", "i"], ["koza", "j"]), one + " hasn't muzhik & koza of different families")
	assert(has_object_without_pair(one, ["kapusta", "i"], ["kapusta", "j"]), one + " hasn't two kapustas of different families")
	assert(has_object_without_pair(one, ["koza", "i"], ["koza", "j"]), one + " hasn't two kozas of different families")

	assert(!has_object_without_pair(one, ["volk", "i"], ["koza"]), one + " has volk & koza")
	assert(!has_object_without_pair(one, ["koza"], ["volk"]), one + " has volk & koza")
	assert(!has_object_without_pair(one, ["volk"], ["kapusta"]), one + " has volk & kapusta")
	assert(!has_object_without_pair(one, ["kapusta"], ["kapusta"]), one + " has two kapustas")
	assert(!has_object_without_pair(one, ["koza"], ["muzhik"]), one + " has muzhik-1 and koza-1")
	assert(!has_object_without_pair(one, ["koza"], ["kapusta"]), one + " has koza & kapusta")
	assert(!has_object_without_pair(one, ["volk"], ["volk"]), one + " hasn't two volks")
	assert(has_object_without_pair(one, ["koza", "i"], ["koza"]), one + " hasn't two kozas")
	assert(has_object_without_pair(one, ["koza"], ["korova"]), one + " hasn't korova for koza")

})()


var wrap_rule = function(first, fun)
{
	return function(obj, arr) {
		return !are_equal_types(obj, first) || fun(obj, arr)
	}
}

var afraids = function(first, second)
{
	return wrap_rule(first, function(obj, arr)
	{
		return every(arr, function(elem)
			{
				return !pair_corresponds(obj, elem, first, second)
			})
	})
}
var disabled = afraids

var needs = function(first, second)
{
	return wrap_rule(first, function(obj, arr)
	{
		return exists(arr, function(elem)
			{
				return pair_corresponds(obj, elem, first, second)
			})
	})
}

var needs_at_least = function(first, second, number)
{
	return wrap_rule(first, function(obj, arr)
	{
		return number <= count(arr, function(elem)
			{
				return pair_corresponds(obj, elem, first, second)
			})
	})
}

var necessary = function(first)
{
	return function(arr)
	{
		return has_object(arr, first)
	}
}

var necessary_at_least = function(first, number)
{
	return function(arr)
	{
		return has_at_least_numbers_of_objects(arr, first, number)
	}
}

var items_rule = function(rules)
{
	return function(arr) {
		return every(arr, function(elem, i){
			return rules(elem, arr)
		})
	}
};

(function test_or_for_needs(){
	var arr = [["f", 1], ["d", 1], ["m", 2], ["d", 2]]
	var rule = items_rule(or(needs(["d", "i"], ["f", "i"]), needs(["d", "i"], ["m", "i"])))
	assert(rule(arr), "Must be true because d-1 has f-1 and d-2 has m-2")
})();

(function test_rules_functions(){
	var man = ["man"]
	var volk = ["volk"]
	var koza = ["koza"]
	var kapusta = ["kapusta"]

	var koza_volk = disabled(koza, volk)
	var koza_kapusta = disabled(kapusta, koza)
	var man_koza = needs(koza, man)
	var man_kapusta = needs(kapusta, man)

	var rule1 = items_rule(and(or(man_koza, koza_volk), or(man_kapusta, koza_kapusta)))
	var rule2 = or(necessary(man), items_rule(and(koza_volk, koza_kapusta)))

	var arrays = [
		[true, [man, volk, koza, kapusta], "That must be OK! man is there"],
		[false, [volk, koza, kapusta], "Alarm! they all eat each other"],
		[true, [man, volk, koza], "That must be OK! man is there"],
		[false, [volk, koza], "Alarm! volk eats koza"],
		[true, [koza, kapusta, man], "That must be OK! man is there"],
		[false, [koza, kapusta], "Alarm! koza eats kapusta"],
		[true, [volk, kapusta, man], "That must be OK! man is there"],
		[true, [volk, kapusta], "That must be OK! volk ok with kapusta"],
		[true, [volk], "That must be OK! any of them ok along"],
		[true, [man], "That must be OK! any of them ok along"],
		[true, [koza], "That must be OK! any of them ok along"],
		[true, [kapusta], "That must be OK! any of them ok along"],
		[true, [volk, man], "That must be OK! any of them ok with man"],
		[true, [koza, man], "That must be OK! any of them ok with man"],
		[true, [kapusta, man], "That must be OK! any of them ok with man"],
		[true, [], "That must be OK! nobody there, there are no conflicts"]
	]

	var test = function(rule, message)
	{
		arrays.forEach(function(elem){
			assert(elem[0] == rule(elem[1]), message + ": " + elem[2])
		})
	}

	test(rule1, "Rule 1")
	test(rule2, "Rule 2")

})();

(function test_needs_at_least(){
	var rule = items_rule(needs_at_least(["stiralka"], ["muzhik"], 3))
	assert(!rule([["stiralka"]]), "needs 3 has 0")
	assert(!rule([["stiralka"], ["muzhik"]]), "needs 3 has 0")
	assert(!rule([["stiralka"], ["muzhik"], ["muzhik"]]), "needs 3 has 0")
	assert(rule([["stiralka"], ["muzhik"], ["muzhik"], ["muzhik"]]), "needs 3 has 3")
	assert(rule([["stiralka"], ["muzhik"], ["muzhik"], ["muzhik"], ["muzhik"]]), "needs 3 has 4")
})();

(function test_needs(){
	var zhul = function(index){return ["zhul", index]}
	var chem = function(index){return ["chem", index]}
	var arr = [chem(1), chem(1),
			zhul(2), chem(2), chem(2),
			zhul(3), chem(3), chem(3)]

	var rules = items_rule(or(needs(["chem", "i"], ["zhul", "i"]), afraids(["chem", "i"], ["zhul", "j"])))

	assert(!rules(arr), "There are chem-1 without zhul-1")
})();










//==========================================================================

//--------- Game logic -----------

//==========================================================================

var POS_RIGHT = "right";
var POS_LEFT = "left";

var game_contructors = (function()
{
	var select_boat_position = function(left, right)
	{
		return left.length > 0 ? POS_LEFT
				: right.length > 0 ? POS_RIGHT
				: POS_LEFT
	};

	(function test_select_boat_position(){
		assert(POS_LEFT == select_boat_position([1, 2], [3, 4]), "left priority")
		assert(POS_LEFT == select_boat_position([1, 2], []), "left priority")
		assert(POS_LEFT == select_boat_position([], []), "left priority")
		assert(POS_RIGHT == select_boat_position([], [1, 2]), "left is empty but right is not")
	})()

	var not_empty = function(arr)
	{
		return arr.length > 0
	}

	var get_weight = function(types_weights, arr)
	{
		var sum = 0;
		var len = arr.length;
		for(var i = 0; i < len; ++i)
		{
			var weight = types_weights[arr[i][0]]
			sum += weight === undefined ? 1 : weight
		}
		return sum
	};

	(function test_get_weight(){
		var types_weights = {
			volk: 2,
			muzhik: 1,
			nothing: 0
		}
		var arr = [["muzhik"], ["volk"], ["kapusta"], ["muzhik"], ["kapusta"], ["nothing"], ["nothing"]]
		assert(6 == get_weight(types_weights, arr), "Sum must be equal 6")
	})()

	var find = function(array, is_match, from, to)
	{
		var len = array.length
		from = from || 0;
		to = to === undefined ? len : to;
		for(var i = from; i < to; ++i)
		{
			if(is_match(array[i], i))
			{
				return i
			}
		}
		return -1
	};

	(function test_find(){
		assert(-1 == find([1, 2, 3, 4], function(){return false}), "must not find anyting")
		assert(0 == find([1, 2, 3, 4], function(){return true}), "must find first (ind=0) element")
		assert(1 == find([1, 2, 3, 4], function(elem){return elem % 2 == 0}), "arr[1] == 2 is first even element")
		assert(3 == find([1, 2, 3, 4], function(elem){return elem % 2 == 0}, 2), "arr[3] == 4 is first even element beginning from [2]")
		assert(-1 == find([1, 2, 3, 4], function(elem){return elem % 4 == 0}, 0, 3), "last elem%%4 is arr[3]==4 but it's over searching interval")
	})()

	var get_transaction_rule = function(transaction_rules, obj)
	{
		return transaction_rules[obj[CI_TYPE]] || true_fun;
	}

	var find_obj_in_arr = function(arr, obj)
	{
		return find(arr, curry(and(are_equal_types, are_equal_families), obj))
	}

	var move = function(transaction_rules, from, to, what)
	{
		var rest = from.slice()
		var target = to.slice()
		var real_what = []
		var all = from.concat(to)

		var what_len = what.length
		for(var i = 0; i < what_len; ++i)
		{
			if(!what[i])
				continue

			var j = find_obj_in_arr(rest, what[i])

			if(j != -1 && get_transaction_rule(transaction_rules, what[i])(all))
			{
				var moved_obj = rest.splice(j, 1)[0]
				real_what.push(moved_obj)
				target.push(moved_obj)
			}
		}

		return {from: rest, to: target, what: real_what}
	};

	(function test_move(){
		var muzh1 = ["muzhik"]
		var transaction_rules = {stiralka: necessary_at_least(["muzhik"], 3)}

		var from1 = [["muzhik"], ["muzhik"], ["muzhik"], ["stiralka"]]
		var to1 = []
		var what1 = [["muzhik"], ["stiralka"]] 
		var result1 = move(transaction_rules, from1, to1, what1)
		assert(result1.from.length == 2, "muzhik, muzhik in from")
		assert(result1.what.length == 2, "muzhik, stiralka were moved ")
		assert(result1.to.length == 2, "muzhik, stiralka in to")

		var from2 = [["muzhik"], ["muzhik"], ["stiralka"]]
		var to2 = [["korova"]]
		var what2 = [["muzhik"], ["stiralka"]] 
		var result2 = move(transaction_rules, from2, to2, what2)
		assert(result2.from.length == 2, "muzhik, stiralka are in from")
		assert(result2.what.length == 1, "muzhik was moved")
		assert(result2.to.length == 2, "muzhik, korova are in to")
	})()

	var do_transaction = function(game, from, to, what,
		from_boat_position, to_boat_position,
		from_rules, to_rules)
	{
		var config = game.config
		
		var result = move(config.transaction_rules, from, game.boat, what)
		if(game.boat_position != from_boat_position
			|| !from_rules(result.from)
			|| !config.boat_rules(result.to)
			|| !config.boat_moving_rules(result.to)
			|| get_weight(config.types_weights, result.to) > config.boat_capacity)
		{
			return false;
		}

		var to_result = move(config.transaction_rules, result.to, to, result.to)
		var to_all = to_result.from.concat(to_result.to)
		
		if(!to_rules(to_all))
		{
			return false;
		}

		game[from_boat_position] = result.from
		game.boat = to_result.from
		game[to_boat_position] = to_result.to
		game.boat_position = to_boat_position

		return true
	}

	var everybody_on_the_right = function(game)
	{
		return game.left.length == 0 && game.boat.length == 0
	}

	var GameRaw = function(cfg)
	{
		this.left = cfg.left || []
		this.right = cfg.right || []
		this.boat = cfg.boat || []
		this.boat_position = cfg.boat || select_boat_position(this.left, this.right)
		this.config = {
			left_rules: cfg.left_rules || cfg.rules || true_fun,
			right_rules: cfg.right_rules || cfg.rules || true_fun,
			boat_rules: cfg.boat_rules || cfg.rules || true_fun,
			boat_moving_rules: cfg.boat_moving_rules || not_empty,
			boat_capacity: cfg.boat_capacity || 0,
			types_weights: cfg.types_weights || [],
			transaction_rules: cfg.transaction_rules || true_fun,
			win_rules: cfg.win_rules || everybody_on_the_right
		}
	}

	GameRaw.prototype.to_right = function(what)
	{
		var game = this
		return do_transaction(game, game.left, game.right, what,
			POS_LEFT, POS_RIGHT,
			game.config.left_rules, game.config.right_rules)
	}

	GameRaw.prototype.to_left = function(what)
	{
		var game = this
		return do_transaction(game, game.right, game.left, what,
			POS_RIGHT, POS_LEFT,
			game.config.right_rules, game.config.left_rules)
	};

	GameRaw.prototype.is_win = function()
	{
		return this.config.win_rules(this)
	};

	(function test_custom_win(){
		var game = new GameRaw({
			left: [["muzhik"], ["muzhik"], ["muzhik"]],
			boat_capacity: 3,
			win_rules: function(game){game.left.length == 2}
		});

		assert(!game.is_win(), "Not win")
		game.to_right([["muzhik"], ["muzhik"]])
		assert(!game.is_win(), "Not win")
		game.to_left([["muzhik"]])
		assert(game.is_win(), "Win")
	});

	(function test_game_stiralka(){
		var game = new GameRaw({
			left: [["muzhik"], ["muzhik"], ["muzhik"], ["stiralka"]],
			boat_capacity: 3,
			boat_rules: necessary(["muzhik"]),
			transaction_rules: {stiralka: necessary_at_least(["muzhik"], 3)}
		});

		assert(game.to_right([["muzhik"], ["muzhik"], ["stiralka"]]), "correct: [muzhik] --- [stiralka]-[muzhik, muzhik]")
		assert(!game.is_win(), "Not win")
		assert(!game.to_right([["muzhik"]]), "Incorrect boat side")
		assert(!game.to_left([]), "Can't go without muzhik")
		assert(game.to_left([["muzhik"]]), "correct: [muzhik, muzhik]-[stiralka] --- [muzhik]")
		assert(!game.is_win(), "Not win")
		assert(game.to_right([["muzhik"], ["muzhik"]]), "correct: [] --- [] - [muzhik, muzhik, muzhik, stiralka]")
		assert(game.is_win(), "Win")
	})();

	(function test_game_volk_koza_kapusta(){
		var muzhik = ["muzhik"]
		var volk = ["volk"]
		var koza = ["koza"]
		var kapusta = ["kapusta"]

		var koza_volk = disabled(koza, volk)
		var koza_kapusta = disabled(kapusta, koza)
		var muzhik_koza = needs(koza, muzhik)
		var muzhik_kapusta = needs(kapusta, muzhik)

		var game = new GameRaw({
			left: [volk, koza, kapusta, muzhik],
			boat_capacity: 2,
			rules: or(necessary(muzhik), items_rule(and(koza_volk, koza_kapusta))),
			boat_rules: necessary(muzhik)
		});

		assert(!game.is_win(), "Not win")
		assert(!game.to_right([volk]), "Can't go without muzhik")
		assert(!game.to_right([muzhik, kapusta]), "Can't go: volk eats koza")
		assert(!game.to_right([muzhik, volk]), "Can't go: koza eats kapusta")
		assert(game.to_right([muzhik, koza]), "Correct: [volk, kapusta] --- []-[muzhik, koza]")
		assert(!game.is_win(), "Not win")
		assert(!game.to_left([koza]), "Can't go without muzhik")
		assert(game.to_left([muzhik, volk]), "There are no volk but muzhik moves: [volk, kapusta, muzhik]-[] --- [koza]")
		assert(!game.is_win(), "Not win")
		assert(!game.to_left([muzhik]), "Boat is already on the left")
		assert(!game.to_right([muzhik, volk, kapusta]), "Overweight!")
		assert(!game.to_right([volk, kapusta]), "Can't go without muzhik")
		assert(game.to_right([muzhik, kapusta]), "Correct: [volk] --- []-[muzhik, koza, kapusta]")
		assert(!game.is_win(), "Not win")
		assert(!game.to_left([muzhik]), "Can't go: koza eats kapusta")
		assert(game.to_left([muzhik, koza]), "Correct: [volk, muzhik, koza]-[] --- [kapusta]")
		assert(!game.is_win(), "Not win")
		assert(game.to_right([muzhik, volk]), "Correct: [koza] --- []-[volk, muzhik, kapusta]")
		assert(!game.is_win(), "Not win")
		assert(game.to_left([muzhik]), "Correct: [koza, muzhik]-[] --- [volk, kapusta]")
		assert(!game.is_win(), "Not win")
		assert(game.to_right([muzhik, koza]), "Correct: [] --- []-[volk, koza, kapusta, muzhik")
		assert(game.is_win(), "Win")
	})()



	var present_object_as_string = function(obj)
	{
		return obj.length > 1 ? obj[0] + "-" + obj[1] : obj[0]
	}

	var present_arr_as_string = function(arr)
	{
		return "[" + map(arr, present_object_as_string).join(", ") + "]"
	}

	var convert_string_to_object = function(str)
	{
		var matches = str.match(/^\W*?((?:\w|[а-я]|[А-Я])+).*?(\d*)\D*$/)
		if(matches == null)
			return null;

		return matches[2].length > 0 ? [matches[1], matches[2]] : [matches[1]]
	};

	var present_game_as_string = function(game_raw)
	{
		var left = present_arr_as_string(game_raw.left)
		var right = present_arr_as_string(game_raw.right)
		var boat = present_arr_as_string(game_raw.boat)

		return game_raw.boat_position == POS_LEFT
			? left + " -- " + boat + "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~" + right
			: left + "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~" + boat + " -- " + right
	};

	(function test_presenting_functions(){
		assert("koza" == present_object_as_string(["koza"]), "Must be 'koza'")
		assert("koza-1" == present_object_as_string(["koza", 1]), "Must be 'koza-1'")

		var result = present_arr_as_string([["koza"], ["koza", 10]])
		assert("[koza, koza-10]" == result,
			"Waiting the '[koza, koza-10]' but was " + result)

		var data = [
			["  asdf23dsa23", 1, "asdf23dsa23", undefined],
			["  asdf23dsa",   1, "asdf23dsa",   undefined],
			["  asdf23dsa-4312njn-_jlk123jkj32fdsa", 2, "asdf23dsa", 32],
			["  asdf23dsa-4312njn-_jlk123jkj32",     2, "asdf23dsa", 32],
			["asdf23dsa-4312njn-_jlk123jkj32",       2, "asdf23dsa", 32],
			["koza",    1, "koza", undefined],
			["koza-10", 2, "koza", 10],
			["koza-10", 2, "koza", 10],
			["", null]
		]

		data.forEach(function(elem){
			var result = convert_string_to_object(elem[0])
			if(result != null)
			{
				assert(elem[1] == result.length, "Length of result must be " + elem[1])
				assert(elem[2] == result[0], "Type of object must be " + elem[2])
				assert(elem[3] == result[1], "Family of object must be " + elem[3])
			}
			else
			{
				assert(elem[1] == null, "Result must be null")
			}
		})
	})()

	var do_game_step = function(raw_game, method_name, args)
	{
		var what = []
		Array.prototype.forEach.call(args, function(elem)
		{
			var parts = map(elem.split(/(?:,|\s)+/), convert_string_to_object)
			what = what.concat(parts)
		})

		return raw_game[method_name](what)
	}

	var Game = function(game_raw)
	{
		this.game_raw = game_raw
	}

	Game.prototype.display_in_log = function()
	{
		console.log(present_game_as_string(this.game_raw));
	}

	Game.prototype.to_right = function()
	{
		return do_game_step(this.game_raw, "to_right", slice.call(arguments))
	}
	Game.prototype.to_left = function()
	{
		return do_game_step(this.game_raw, "to_left", slice.call(arguments))
	};
	Game.prototype.is_win = function()
	{
		return this.game_raw.is_win()
	};

	(function test_game_stiralka(){
		var game_raw = new GameRaw({
			left: [["muzhik", 1], ["muzhik", 2], ["muzhik"], ["stiralka"]],
			boat_capacity: 3,
			boat_rules: necessary(["muzhik"]),
			transaction_rules: {stiralka: necessary_at_least(["muzhik"], 3)}
		});
		var game = new Game(game_raw)
		var present =  curry(present_game_as_string, game_raw);

		assert(game.to_right("muzhik-1, muzhik-2", "stiralka"), "correct: [muzhik] --- [stiralka]-[muzhik-1, muzhik-2]")
		assert(!game.is_win(), present)
		assert(!game.to_right("muzhik"), "Incorrect boat side")
		assert(!game.to_left(""), "Can't go without muzhik")
		assert(game.to_left("muzhik-1"), "correct: [muzhik, muzhik-1]-[stiralka] --- [muzhik-2]")
		assert(!game.is_win(), present)
		assert(game.to_right("muzhik", "muzhik-1"), "correct: [] --- [] - [muzhik, muzhik-1, muzhik-2, stiralka]")
		assert(game.is_win(), present)
	})();

	return {Game: Game, GameRaw: GameRaw}
})()













//==========================================================================

//------- Globals. Game infrastructure ---------

//==========================================================================

var infrastructure = (function(){

	var Game = game_contructors.Game
	var GameRaw = game_contructors.GameRaw


	var print = function(value) 
	{
		var args = slice.call(arguments, 1)
		var type = typeof value
		if(type == "function")
		{
			value.apply(this, args)
		}
		else if(type == "object" && value.constructor.toString().match("function Array.*"))
		{
			value.forEach(function(elem)
			{
				print.apply(this, [elem].concat(args))
			})
		}
		else
		{
			console.log(value)
			if(args.length > 0)
			{
				print.apply(this, args)
			}
		}
	}

	var print_help = function() {
		print(commands.help.main)
		print()
	}

	var print_commands = function(obj)
	{
		for(var i in obj)
		{
			if(obj.hasOwnProperty(i))
			{
				print(i + "\t\t" + obj[i].help.description)
			}
		}
	}

	var lesson = {
		description : "Example lesson",
		problems : [
			{
				title : "Volk, koza i kapusta",
				description : ["What does the", "fox say"],
				config : (function volk_koza_kapusta(){
					var muzhik = ["muzhik"]
					var volk = ["volk"]
					var koza = ["koza"]
					var kapusta = ["kapusta"]

					var koza_volk = disabled(koza, volk)
					var koza_kapusta = disabled(kapusta, koza)
					var muzhik_koza = needs(koza, muzhik)
					var muzhik_kapusta = needs(kapusta, muzhik)

					return {
						left: [volk, koza, kapusta, muzhik],
						boat_capacity: 2,
						rules: or(necessary(muzhik), and(koza_volk, koza_kapusta)),
						boat_rules: necessary(muzhik)
					}
				})()
			}
		]
	}

	var current_problem_index;
	var current_game;

	var select_problem = function(index)
	{
		current_problem_index = index
		current_game = new Game(new GameRaw(lesson.problems[index].config))
	}
	select_problem(0)

	var commands = {
		help : function(command)
		{
			if(!command)
			{
				print(commands.help.help.main)
				print_commands(commands)
			}
			else
			{
				print(commands[command].help.full_description)
			}
		},

		list : function()
		{
//			print(lesson.description, "")
			var len = lesson.problems.length
			for(var i = 0; i < len; ++i)
			{
				print("№ " + i + ".\t" + lesson.problems[i].title)
			}
		},

		show : function(index)
		{
			index = index === undefined ? current_problem_index : index
			var problem = lesson.problems[index]

			print("№ " + index + "." + problem.title + "\n")
			print(problem.description)
			print("\n")
			current_game.display_in_log()
		},

		start : function(index)
		{
			index = index === undefined ? current_problem_index : index
			select_problem(index)
		},

		restart : function()
		{
			select_problem(current_problem_index)
		},

		state : function()
		{
			current_game.display_in_log()
		},

		to_left : function()
		{
			current_game.to_left.apply(current_game, arguments)
			current_game.display_in_log()
		},

		to_right : function()
		{
			current_game.to_right.apply(current_game, arguments)
			current_game.display_in_log()
		}
	}

	var init_global_commands = function()
	{
		for(var i in commands)
		{
			if(commands.hasOwnProperty(i))
			{
				window[i] = commands[i]
			}
		}
	}


	var init_messages = function(messages) {


		for(var i in commands)
		{
			if(commands.hasOwnProperty(i))
			{
				commands.help[i] = commands[i].help = curry(commands.help, i)
				commands[i].help.description = messages[i]
				commands[i].help.full_description = messages[i + "_full"]
			}
		}

		commands.help.help.main = messages.help_main
	}

	var init_lesson = function(lesson1)
	{
		lesson = lesson1
		select_problem(0)
	}

	return {
		init_global_commands : init_global_commands,
		init_messages :        init_messages,
		init_lesson :          init_lesson
	}
})();

(function(){
	var help_messages = {
		help : "help() - вывести эту справку; help.command() или command.help() - вывести справку по конкретной команде",
		help_main: "доступны следующие команды:\n",
		help_full: [
			"Команда help() применённая к другой команде выводит справку по ней",
			"Примеры:",
			"\thelp.list()",
			"\tlist.help()",
			"\thelp.to_left()",
			"\thelp.help()"],

		list: "вывести список задач (№, название)",
		list_full: ["Команда list() выводит список имеющихся задач. Вызывается без параметров.",
			"Пример:", "\tlist()"],

		show: "show(), show(number) - показать условие задачи",
		show_full: ["Команда show() с указанным в скобках номером задачи выводит условие этой задачи",
			"Вызыванная команда show() без аргументов показывает условие текущей задачи.",
			"Примеры:",
			"\tshow()\t - выведет условие текущей заадчи",
			"\tshow(5)\t - выведет условие пятой заадчи"],

		start: "start(number) - начать решать задачу с номером number",
		start_full: ["Команда start() с указанным в скобках номером задачи стартует соответствующую задачу.",
			"Вы её решаете, перемещая героев с берега на берег при помощи команд to_left() и to_right()",
			"Пример:", "\tstart(5)\t - стартуем пятую задачу"],

		restart: "начать решать текущую задачу заново",
		restart_full: ["Команда restart() сбрасывает все ваши действия и вы начинаете решать задачу заново. Команда restart() вызывается без аргументов"],

		state: "отобразить состояние текущей задачи",
		state_full: ["Команда state() вызывается без аргументов и отображает состояние текущей игры. Показывает, где какой участник расположен: на лодке или на одном из берегов.",
			"Формат отображения следующий:",
			"[левый берег] -- [лодка] ~~~~~~~~~~~~~~ [правый берег]\t - если лодка на левом берегу",
			"[левый берег] ~~~~~~~~~~~~~~ [лодка] -- [правый берег]\t - если лодка на правом берегу",
			"Примеры:",
			"\tstate() \t -> \t [волк, капуста] ~~~~~~~~~~~~~~ [] -- [коза, лодочник]"],

		to_left: "to_left(\"волк, коза, капуста\") - отправить перечисленных участников на левый берег",
		to_left_full: "to_left(\"волк, коза, капуста\") - отправить перечисленных участников на левый берег",
		to_right: "to_right(\"чемодан-1, чел-1\") - отправить перечисленных участников на правый берег",
		to_right_full: "to_right(\"волк, коза, капуста\") - отправить перечисленных участников на правый берег"
	}


	infrastructure.init_messages(help_messages)
})();




//==========================================================================

//------- Problems ---------

//==========================================================================
(function(){
	var lesson = {
		title : "Переправы от Шаповаловых",
		description : ["Все знают задачу про перевозку волка, козы и капусты. В первый раз она производит большое впечатление. Ведь казалось, что невозможно, и вдруг - вот способ! И всё так наглядно: можно взять фигурки и подвигать их, а то и поиграть: тф будешь козой, ты волком, ты крестянином...",
				"Подборки задач на переправу пользуются популярностью. Но вот список сюжетов в них очень небольшой: два мальчика и полк солдат, рыцари и оруженосцы (или дамы сердца), миссионеры и каннибалы (или купцы и разбойники), переход через мост с фонариком. Для каждого сюжета есть 2-3 задачи. Мало!",
				"Тогда я решил придумать сам. С первой задачей помог сын, вспомнив, как мы переезжали на новую квартиру и грузчиков не хватало. Оказалось, что в такие задачи можно \"зашить\" математику и посерьёзнее. Порешайте и убедитесь в этом сами. Только давайте сразу договоримся: никаких нематематических трюков с выпрыгиванием из лодки, которая не пристала к берегу. А лодку, приставшую к берегу, будем считать частью этого берега."],

		problems : [
			{
				title : "Волк, коза и капуста",
				description : ["Классическая задача. Если лодочник уплыл, то волк ест козу, или коза ест капусту. В лодку помещается не более двух персонажей, а грести умеет только лодочник. Как всем переправиться?",
					"\n\tКомандой state() вы отображаете текущее состояние.",
					"\tКомандами to_right(), to_left() возите героев туда-сюда",
					"\tПример:",
					"\t\tto_right(\"лодочник, волк\")"],
				config : (function volk_koza_kapusta(){
					var muzhik = ["лодочник"]
					var volk = ["волк"]
					var koza = ["коза"]
					var kapusta = ["капуста"]

					var koza_volk = disabled(koza, volk)
					var koza_kapusta = disabled(kapusta, koza)
					var muzhik_koza = needs(koza, muzhik)
					var muzhik_kapusta = needs(kapusta, muzhik)

					return {
						left: [volk, koza, kapusta, muzhik],
						boat_capacity: 2,
						rules: or(necessary(muzhik), items_rule(and(koza_volk, koza_kapusta))),
						boat_rules: necessary(muzhik)
					}
				})()
			},{
				title : "Стиральная машина",
				description : ["Три человека со стиральной машиной хотят переправиться через реку. Катер вмещает либо двух человек и стиральную машину, либо трёх человек. Беда в том, что стиральная машина тяжёлая, поэтому погрузить её в катер или вытащить из него можно только втроём. Смогут ли они переправиться?",
					"\n\tКомандой state() вы отображаете текущее состояние.",
					"\tКомандами to_right(), to_left() возите героев туда-сюда",
					"\tПример:",
					"\t\tto_right(\"чел, чел, стиралка\")"],
				config : (function stiralnaya_mashina(){
					var muzhik = ["чел"]
					var stiralka = ["стиралка"]
					return {
						left: [muzhik, muzhik, muzhik, stiralka],
						boat_capacity: 3,
						boat_rules: necessary(muzhik),
						transaction_rules: {"стиралка": necessary_at_least(muzhik, 3)}
					}
				})()
			},{
				title : "Три жулика и шесть чемоданов",
				description : ["Три жулика, каждый с двумя чемоданами, находятся на одном берегу реки, через которую они хотят переправиться. Есть трёхместная лодка, каждое место в ней может быть занято либо человеком, либо чемоданом. Никто из жуликов не доверит свой чемодан спутникам в своё отсутствие, но готов оставить чимоданы на безлюдном берегу. Смогут ли они переправиться?",
					"\n\tКомандой state() вы отображаете текущее состояние.",
					"\tКомандами to_right(), to_left() возите героев туда-сюда",
					"\tж - жулик, ч - чемодан.",
					"\tПример:",
					"\t\tto_right(\"ж-1, ж-2, ч-1\")"],
				config : (function tri_zhulika(){
					var zhul = function(index){return ["ж", index]}
					var chem = function(index){return ["ч", index]}
					return {
						left: [zhul(1), chem(1), chem(1),
							zhul(2), chem(2), chem(2),
							zhul(3), chem(3), chem(3)],
						boat_capacity: 3,
						rules: items_rule(or(needs(["ч", "i"], ["ж", "i"]), afraids(["ч", "i"], ["ж", "j"]))),
						boat_rules: necessary(["ж"])
					}
				})()
			},{
				title : "Две семьи (a)",
				description : ["Две семьи (в каждой папа, мама и дочь) хотят переправиться через реку. Есть двухместная лодка. Грести могут только мужчины. Дочери могут быть на берегу или в лодке только вместе с кем-нибудь из своих родителей. Как им всем переправиться на другой берег?",
					"\n\tКомандой state() вы отображаете текущее состояние.",
					"\tКомандами to_right(), to_left() возите героев туда-сюда",
					"\tf - папа, m - мама, d - дочь",
					"\tПример:",
					"\t\tto_right(\"p-1, d-1\")"],
				config : (function dve_semyi_a(){
					//var zhul = function(index){return ["ж", index]}
					//var chem = function(index){return ["ч", index]}
					return {
						left: [["f", 1], ["m", 1], ["d", 1],
							["f", 2], ["m", 2], ["d", 2]],
						boat_capacity: 2,
						rules: items_rule(or(needs(["d", "i"], ["f", "i"]), needs(["d", "i"], ["m", "i"]))),
						boat_rules: necessary(["f"])
					}
				})()
			},{
				title : "Две семьи (б)",
				description : ["Задача почти как предыдущая с одним дополнением.\nДве семьи (в каждой папа, мама и дочь) хотят переправиться через реку. Есть двухместная лодка. Грести могут только мужчины. Дочери могут быть на берегу или в лодке только вместе с кем-нибудь из своих родителей, а никакую из женщин нельзя оставлять на берегу одну. Как им всем переправиться на другой берег?",
					"\n\tКомандой state() вы отображаете текущее состояние.",
					"\tКомандами to_right(), to_left() возите героев туда-сюда",
					"\tf - папа, m - мама, d - дочь",
					"\tПример:",
					"\t\tto_right(\"p-1, d-1\")"],
				config : (function dve_semyi_a(){
					return {
						left: [["f", 1], ["m", 1], ["d", 1],
							["f", 2], ["m", 2], ["d", 2]],
						boat_capacity: 2,
						rules: items_rule(and(
								or(
									needs(["d", "i"], ["f", "i"]),
									needs(["d", "i"], ["m", "i"])
								),
								or(
									needs(["m"], ["m"]), 
									needs(["m"], ["d"]), 
									needs(["m"], ["f"])
								)
							)),
						boat_rules: necessary(["f"])
					}
				})()
			}
		]
	}

	infrastructure.init_lesson(lesson)
})()




	infrastructure.init_global_commands();


})()