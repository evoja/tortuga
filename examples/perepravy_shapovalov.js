(function()
{
// CI means index
var CI_TYPE = 0;
var CI_FAMILY = 1;
var CI_ID = 2;

var slice = Array.prototype.slice
var bind = Function.prototype.bind

var test_count = 0;

var assert = function(bool, message)
{
	if(!bool)
	{
		console.log("Test #" + test_count + " failed: ", message);
	}
	++test_count;
}


var true_fun = function(){return true}

var and = function(fun1, fun2)
{
	return function()
	{
		return fun1.apply(null, arguments) && fun2.apply(null, arguments)
	}
};

(function(){
	var more3 = function(x){return x > 3}
	var less7 = function(x){return x < 7}
	var more_less = and(more3, less7)
	assert(more_less(4), "3 < 4 < 7")
	assert(more_less(5), "3 < 5 < 7")
	assert(more_less(6), "3 < 6 < 7")
	assert(!more_less(3), "3 < 3 < 7!!!")
	assert(!more_less(7), "3 < 7 < 7!!!")
})()

var or = function(fun1, fun2)
{
	return function()
	{
		return fun1.apply(null, arguments) || fun2.apply(null, arguments)
	}
};

(function(){
	var more6 = function(x){return x > 6}
	var less4 = function(x){return x < 4}
	var more_less = or(more6, less4)
	assert(!more_less(4), "3 < 4 < 7")
	assert(!more_less(5), "3 < 5 < 7")
	assert(!more_less(6), "3 < 6 < 7")
	assert(more_less(3), "3 < 3 < 7!!!")
	assert(more_less(7), "3 < 7 < 7!!!")
})()

var not = function(fun)
{
	return function()
	{
		return !fun.apply(null, arguments)
	}
};

(function(){
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

(function(){
	assert(are_equal_families(["volk", 0], ["koza", 0]), "0 == 0")
	assert(!are_equal_families(["volk", 0], ["volk", 1]), "0 != 1")
})()

var are_equal_types = function(first, second)
{
	return first[CI_TYPE] == second[CI_TYPE]
};

(function(){
	assert(are_equal_types(["volk", 0], ["volk", 1]), "volk == volk")
	assert(!are_equal_types(["volk", 0], ["koza", 0]), "volk != koza")
})()

var are_equal_objects = function(first, second)
{
	return first[CI_ID] == second[CI_ID]
		&& are_equal_types(first, second)
		&& 0 == compare_families(first, second)
};

(function(){
	assert(are_equal_objects(["volk", 0, 0], ["volk", 0, 0]), "[volk, 0, 0] == [volk, 0, 0]")
	assert(!are_equal_objects(["volk", 0, 1], ["volk", 0, 0]), "[volk, 0, 1] != [volk, 0, 0]")
	assert(!are_equal_objects(["volk", 1, 0], ["volk", 0, 0]), "[volk, 1, 0] != [volk, 0, 0]")
	assert(!are_equal_objects(["volk", 0, 0], ["koza", 0, 0]), "[volk, 0, 0] != [koza, 0, 0]")
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
			if(family_checker(f, s) && !are_equal_objects(f, s))
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

(function(){
	var one = [["volk", 0, 0], ["koza", 1, 1], ["volk", 1, 2], ["kapusta", 0, 3], ["muzhik", 1, 4], ["kapusta", 0, 5]]
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
			if(family_checker(f, s) && !are_equal_objects(f, s))
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

(function(){
	var one = [["volk", 0, 0], ["koza", 1, 1], ["volk", 1, 2], ["kapusta", 0, 3], ["muzhik", 1, 4], ["kapusta", 0, 5]]
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


// var disable_pair = function(first, second)
// {
// 	var checker = function(arr)
// 	{

// 	}
// }

// var game = {
// 	right: [["man"], ["volk"], ["koza"], ["kapusta"]],
// 	left: [],
// 	boat: [],
// 	boat_position: "right",
// 	rules:
// }









// // Tests 


})()