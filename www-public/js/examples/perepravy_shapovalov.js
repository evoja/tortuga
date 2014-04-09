(function()
{


//==========================================================================

//------- Core logic ---------

//==========================================================================


// CI means index
var CI_TYPE = 0
var CI_FAMILY = 1

var bind = Function.prototype.bind
var slice = Array.prototype.slice

var curry = function(fun /*, arguments */)
{
	var scope = this
	var args1 = slice.call(arguments, 1)
	return function(/* arguments */)
	{
		return fun.apply(scope, args1.concat(slice.apply(arguments)));
	}
}

var curryl = function(fun /* other */)
{
	var scope = this
	var args1 = slice.call(arguments, 1)
	return function(/* arguments */)
	{
		return fun.apply(scope, slice.apply(arguments).concat(args1))
	}
}

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

var assert = function(success, message)
{
	if(!success)
	{
		message = typeof message == "function" ? message() : message
		log("Failed: ", message)
	}
}

var is_array = function(obj)
{
	return typeof obj == "object" && obj.constructor.toString().match("function Array.*")
}

var map = function(arr, fun, include_external)
{
	var result = []
	if(is_array(arr))
	{
		var arr_len = arr.length
		for(var i = 0; i < arr_len; ++i)
		{
			result.push(fun(arr[i], i))
		}
	}
	else
	{
		for(var i in arr)
		{
			if(include_external || arr.hasOwnProperty(i))
			{
				result.push(fun(arr[i], i))
			}
		}
	}
	return result
}

var map_obj = function(arr, fun, include_external)
{
	var result = {}
	for(var i in arr)
	{
		if(include_external || arr.hasOwnProperty(i))
		{
			result[i] = fun(arr[i], i)
		}
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

var is_family_defined = function(obj)
{
	return obj[CI_FAMILY] !== undefined;
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

var is_object_corresponds = function(obj, first)
{
	return are_equal_types(obj, first)
		&& (!first[CI_FAMILY] || are_equal_families(obj, first))
}

var has_object = function(arr, first)
{
	return exists(arr, curry_gaps(is_object_corresponds, undefined, first))
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
	return num <= count(arr, curry(are_equal_types, obj))
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
		return every(arr, curry_gaps(not(pair_corresponds), obj, undefined, first, second))
	})
}
var disabled = afraids

var needs = function(first, second)
{
	return wrap_rule(first, function(obj, arr)
	{
		return exists(arr, curry_gaps(pair_corresponds, obj, undefined, first, second))
	})
}

var needs_at_least = function(first, second, number)
{
	return wrap_rule(first, function(obj, arr)
	{
		return number === undefined
			? second <= arr.length
			: number <= count(arr, curry_gaps(pair_corresponds, obj, undefined, first, second))
	})
}

var necessary = function(first)
{
	return curryl(has_object, first)
}

var necessary_at_least = function(first_or_number, number_or_undefined)
{
	return function(arr)
	{
		return (number_or_undefined === undefined)
			? arr.length >= first_or_number
			: has_at_least_numbers_of_objects(arr, first_or_number, number_or_undefined)
	}
}

var items_rule = function(rules)
{
	return function(arr) {
		return every(arr, curry_gaps(rules, undefined, arr))
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

		if(typeof transaction_rules != "function" || transaction_rules(all))
		{
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

	var move_from_side_to_side = function(game, from, to, what,
		from_boat_position, to_boat_position,
		from_rules, to_rules)
	{
		var config = game.config
		
		var boat_result = move(config.transaction_rules, from, game.boat, what)
		var boat_weight = get_weight(config.types_weights, boat_result.to)
		if(game.boat_position != from_boat_position
			|| !from_rules(boat_result.from)
			|| !config.boat_rules(boat_result.to)
			|| !config.boat_moving_rules(boat_result.to)
			|| boat_weight > config.boat_capacity)
		{
			return false;
		}

		var transaction_to = to.slice()
		var to_result = move(config.transaction_rules, boat_result.to, to, boat_result.to)
		var to_all = to_result.from.concat(to_result.to)
		
		if(!to_rules(to_all))
		{
			return false;
		}

		game[from_boat_position] = boat_result.from
		game.boat = to_result.from
		game[to_boat_position] = to_result.to
		game.boat_position = to_boat_position
		game.last_moving_timestamp = new Date().getTime()

		return {
			transaction_what: boat_result.to,
			transaction_from: boat_result.from,
			transaction_to : transaction_to,
			from_boat_position : from_boat_position,
			weight_what : boat_weight
		}
	}

	var do_transaction = function(game, from, to, what,
		from_boat_position, to_boat_position,
		from_rules, to_rules)
	{
		var result = move_from_side_to_side.apply(this, arguments)

		game.config.score_counter(result, game)

		var win_result = game.config.win_rules(game)
		if(win_result)
		{
			game.print_fun(win_result === true ? "Победа!" : win_result)
		}
		var loose_result = game.config.loose_rules(game)
		if(loose_result)
		{
			game.print_fun(loose_result === true ? "Поражение!" : loose_result)
		}
		game.config.print_score(game)

		return Boolean(result)
	}

	var everybody_on_the_right = function(game)
	{
		return game.left.length == 0 && game.boat.length == 0
	}

	var simple_score_counter = function(result, game)
	{
		if(result)
		{
			++game.score 
		}
	}

	var simple_print_score = function(game)
	{
		game.print_fun(game.score + " рейсов")
	}

	var GameRaw = function(cfg, print_fun)
	{
		this.left = cfg.left || []
		this.right = cfg.right || []
		this.boat = cfg.boat || []
		this.boat_position = cfg.boat_position || select_boat_position(this.left, this.right)
		this.score = 0
		this.print_fun = print_fun || function(){}
		this.last_moving_timestamp = new Date().getTime()
		this.config = {
			left_rules: cfg.left_rules || cfg.rules || true_fun,
			right_rules: cfg.right_rules || cfg.rules || true_fun,
			boat_rules: cfg.boat_rules || cfg.rules || true_fun,
			boat_moving_rules: cfg.boat_moving_rules || not_empty,
			boat_capacity: cfg.boat_capacity || 0,
			types_weights: cfg.types_weights || {},
			transaction_rules: cfg.transaction_rules || true_fun,
			win_rules: cfg.win_rules || everybody_on_the_right,
			loose_rules : cfg.loose_rules || not(true_fun),
			score_counter : cfg.score_counter || simple_score_counter,
			print_score : cfg.print_score || simple_print_score
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
			boat_moving_rules: necessary(["muzhik"]),
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
			boat_moving_rules: necessary(muzhik)
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
			boat_moving_rules: necessary(["muzhik"]),
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

//------- Drawing ---------

//==========================================================================
var drawing_infrastructure = (function(){
	var cell_size = 15
	var cell_vertical_size = 3 * cell_size
	var gap_size = cell_size * .3
	var boat_gap = cell_size * .6
	var cells_in_row = 6
	var positions_interval = 2 * cell_size
	var start_position = 20
	var start_vertical_position = 50
	var start_river_position = cells_in_row * (cell_size + gap_size) - gap_size + positions_interval
	var start_right_position = 450
	var end_river_position = start_right_position - positions_interval
	var animation_speed = 1/12

	draw_rectangle = function(w_prop, h_prop, t)
	{
		t.tailDown()
		repeat(2)
		t.go(w_prop * cell_size).rotate(90).go(h_prop * cell_size).rotate(90)
		end()
		t.tailUp()
	}
	draw_man = function(prop, t)
	{
		var leg_size = prop * cell_size
		var arm_size = leg_size * .7
		var neck_size = leg_size / 10
		var head_step = leg_size / 20

		//legs
		t.tailDown()
		t.rotate(60).go(leg_size).rotate(-120).go(leg_size)
		t.tailUp()
		t.go(-leg_size).rotate(150)

		//body
		t.tailDown().go(leg_size)

		//arms
		t.rotate(120).go(arm_size).tailUp()
		t.go(-arm_size).rotate(120)
		t.tailDown().go(arm_size).tailUp()
		t.go(-arm_size).rotate(120)

		//neck
		t.tailDown().go(neck_size)

		//head
		t.rotate(-90)
		repeat(20)
			t.go(head_step).rotate(360 / 20)
		end()
		t.tailUp()

		//back way
		t.rotate(90).go(-neck_size).go(-leg_size).rotate(-30).go(-leg_size)
		t.rotate(-60)
	}
	draw_woman = function(prop, t)
	{
		var leg_size = prop * cell_size
		var arm_size = leg_size * .8
		var neck_size = leg_size / 10
		var head_step = leg_size / 20

		var dress_size = leg_size * Math.cos(15 / 180 * Math.PI) * 2

		//dress
		t.tailDown()
		t.rotate(75).go(dress_size).rotate(-150).go(dress_size)
		t.rotate(75).go(-leg_size)
		t.tailUp()
		t.rotate(75).go(dress_size).rotate(15)

		// //body
		// t.tailDown().go(leg_size)

		//arms
		t.tailDown().rotate(120).go(arm_size).tailUp()
		t.go(-arm_size).rotate(120)
		t.tailDown().go(arm_size).tailUp()
		t.go(-arm_size).rotate(120)

		//neck
		t.tailDown().go(neck_size)

		//head
		t.rotate(-90)
		repeat(20)
			t.go(head_step).rotate(360 / 20)
		end()
		t.tailUp()

		//back way
		t.rotate(90).go(-neck_size).go(-leg_size).rotate(-30).go(-leg_size)
		t.rotate(-60)
	}
	draw_triangle= function(prop, t)
	{
		var size = prop * cell_size
		t.tailDown()
		repeat(3)
		t.go(size).rotate(120)
		end()
		t.tailUp()
	}

	var draw_arr = function(t, colors, drawers, arr)
	{
		var rows = 0
		var cols = 0
		var gap = cell_size + gap_size
		arr.forEach(function(elem){
			t.setColor(colors[elem[CI_FAMILY]] || colors[elem[CI_TYPE]] || "black")
			drawers[elem[CI_TYPE]](t)
			t.go(gap)
			++cols
			if(cols >= cells_in_row)
			{
				t.go(-gap * cols).rotate(90).go(cell_vertical_size).rotate(-90)
				cols = 0
				++rows
			}
		})
		t.go(-(gap) * cols).rotate(90).go(-cell_vertical_size * rows).rotate(-90)
	}

	var draw_river = function(t)
	{
		t.go(start_position)
		t.go(start_river_position / 2 + end_river_position / 2)
		t.setWidth(end_river_position - start_river_position)
		t.setColor("#5cf")
		t.rotate(90).tailDown()
		t.go(1000).go(-1000)
		t.tailUp().rotate(-90)
		t.setWidth(1)
		t.go(- start_river_position / 2 - end_river_position / 2)
		t.go(-start_position)
	}

	var get_boat_width = function(boat_capacity)
	{
		return 2 * boat_gap + boat_capacity * (cell_size + gap_size) - gap_size
	}

	var draw_boat = function(t, boat_capacity)
	{
		t.setColor("black")
		var diag = boat_gap * Math.sqrt(2)
		var cap_size = get_boat_width(boat_capacity) - 2 * boat_gap
		t.rotate(90).go(boat_gap).rotate(-90)
		t.tailDown()
		t.rotate(-45).go(diag).rotate(45).go(cap_size).rotate(45).go(diag)
		t.tailUp()
		t.go(-diag).rotate(-45).go(-cap_size).rotate(-45).go(-diag).rotate(45)
		t.rotate(90).go(-boat_gap).rotate(-90)
	}

	var draw_game = function(t, left, boat, right, boat_capacity,
		colors, drawers, boat_relative_position)
	{
		begin()
		draw_river(t)
		var all = left.concat(boat).concat(right)
		var draw = curry(draw_arr, t, colors, drawers)

		boat_capacity = Math.min(boat_capacity, cells_in_row)
		var boat_width = get_boat_width(boat_capacity)
		var boat_position = start_river_position + (end_river_position - start_river_position - boat_width) * boat_relative_position

		t.go(start_position).rotate(90).go(start_vertical_position).rotate(-90)
		draw(left)
		t.go(boat_position)
		draw_boat(t, boat_capacity)
		t.go(boat_gap)
		draw(boat)
		t.go(-boat_gap)
		t.go(start_right_position - boat_position)
		draw(right)
		t.go(-start_right_position)
		t.go(-start_position).rotate(90).go(-start_vertical_position).rotate(-90)
		end()
	}

	var drawers = {
		man: curry(curry, draw_man),
		woman: curry(curry, draw_woman),
		rectangle: curry(curry, draw_rectangle),
		triangle: curry(curry, draw_triangle)
	}

	var t;
	var animator;

	var Animator = function(game, t)
	{
		this.game = game
		this.last_updated_timestamp = 0
		this.animation_stack = []
	}
	Animator.prototype.start = function()
	{
		var scope = this
		scope.is_stopped = false;

		(function redraw(){

			if(scope.is_stopped)
				return

			var game_raw = scope.game.game_raw
			var config = scope.game.config
			var position = game_raw.boat_position == POS_LEFT ? 0 : 1

			if((t || createTortoise) 
				&& scope.last_updated_timestamp < game_raw.last_moving_timestamp)
			{
				t = t || createTortoise(0, 0)

				clearCanvas()
				if(scope.animation_stack.length == 0)
				{
					draw_game(t, game_raw.left, game_raw.boat, game_raw.right,
						game_raw.config.boat_capacity,
						config.colors, config.drawers, position)
					scope.last_updated_timestamp = game_raw.last_moving_timestamp
				}
				else
				{
					var ap = scope.animation_stack[0]
					draw_game(t, ap.left, ap.boat, ap.right,
						game_raw.config.boat_capacity,
						config.colors, config.drawers, ap.position)
					ap.position += ap.direction * animation_speed

					if(ap.position < 0 || ap.position > 1)
					{
						scope.animation_stack.shift()
					}

					ap.position = Math.max(0, Math.min(1, ap.position))
					requestAnimationFrame(redraw)
					return
				}
			}
			if(!scope.is_animation)
			{
				setTimeout(redraw, 200)
			}
		})()
	}
	Animator.prototype.stop = function()
	{
		this.is_stopped = true;
	}
	Animator.prototype.animate_movement = function(left, boat, right, from_position)
	{
		var scope = this
		scope.animation_stack.push({
			left: left,
			boat: boat,
			right:right,
			direction: from_position == POS_LEFT ? 1 : -1,
			position: from_position == POS_LEFT ? 0 : 1
		})
	}

	var stop_drawing = function()
	{
		if(animator)
		{
			animator.stop()
		}
		if(clearCanvas)
		{
			clearCanvas()
		}
	}

	var start_drawing = function(game)
	{
		stop_drawing()
		if(game.config.drawers)
		{
			animator = new Animator(game)
			animator.start()
		}
	}

	var animate_movement = function(left, boat, right, from_position)
	{
		if(animator)
		{
			animator.animate_movement(left, boat, right, from_position)
		}
	}

	window.dr = drawers

	return {
		drawers : drawers,
		start_drawing : start_drawing,
		stop_drawing : stop_drawing,
		animate_movement : animate_movement
	}
})()




//==========================================================================

//------- Globals. Game infrastructure ---------

//==========================================================================

var infrastructure = (function(){

	var Game = game_contructors.Game
	var GameRaw = game_contructors.GameRaw

	var append_arr_or_str = function(to, what)
	{
		if(is_array(what))
		{
			what.forEach(function(elem){to.push(elem)})
		}
		else
		{
			to.push(what)
		}
	}

	var prepare_print_string = function(value)
	{
		var args = slice.call(arguments, 1)
		var type = typeof value
		if(type == "function")
		{
			return value.apply(this, args)
		}
		else if(type == "object" && value.constructor.toString().match("function Array.*"))
		{
			var output = []
			map(value, function(elem)
				{
					return prepare_print_string.apply(this, [elem].concat(args))
				}
			).forEach(curry(append_arr_or_str, output))
			return output
		}
		else if(args.length > 0)
		{
			var output = [value]
			append_arr_or_str(output, prepare_print_string.apply(this, args))
			return output
		}
		else
		{
			return value
		}
	}

	var print = function() 
	{
		var result = prepare_print_string.apply(this, arguments)
		if(typeof result == "object" && result.constructor.toString().match("function Array.*"))
		{
			console.log(result.join("\n"))
		}
		else
		{
			console.log(result)
		}
	}

	var print_help = function()
	{
		print(commands.help.main)
		print()
	}

	var lessons = []
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
						boat_moving_rules: necessary(muzhik)
					}
				})()
			}
		]
	}

	var current_problem_index;
	var current_game;
	var messages = {}

	var print_commands = function(obj)
	{
		print(map(obj, function(elem, i)
			{
				return i + "\t\t" + messages[i]
			}
		))
	}

	var help = function(command)
	{
		if(!command)
		{
			print(messages.help_main)
			print_commands(commands)
			print(messages.help_post_execute_message)
		}
		else
		{
			print(messages[command + "_full"] || messages[command])
		}
	}

	var show_problems_of_lesson = function(index)
	{
		var less = index === undefined ? lesson : lessons[index]
		print(less.title + "\n")

		print(map(less.problems, function(elem, i)
			{
				return "№ " + i + ".\t" + elem.title
			}))

		print("")

		if(less === lesson)
		{
			print(messages.problems_post_execute_message, current_problem_index)
		}
		else
		{
			print(messages.problems_post_execute_message_for_other_lesson,
				index, lesson.title)
		}
	}

	var select_problem = function(index)
	{
		if(!lesson.problems[index])
		{
			return false
		}

		current_problem_index = index
		var cfg = lesson.problems[index].config
		if(typeof cfg == "function")
		{
			cfg = cfg.apply(null, slice.call(arguments, 1))
		}

		current_game = new Game(new GameRaw(cfg, print))

		if(cfg.drawers)
		{
			current_game.config = {
				drawers: cfg.drawers,
				colors: cfg.colors || {}
			}

			var old_score_counter = current_game.game_raw.config.score_counter
			current_game.game_raw.config.score_counter = function(result, game)
			{
				if(result)
				{
					if(result.from_boat_position == POS_LEFT)
						drawing_infrastructure.animate_movement(
							result.transaction_from,
							result.transaction_what,
							result.transaction_to,
							result.from_boat_position)
					else
						drawing_infrastructure.animate_movement(
							result.transaction_to,
							result.transaction_what,
							result.transaction_from,
							result.from_boat_position)
				}
				old_score_counter(result, game)
			}
			drawing_infrastructure.start_drawing(current_game)
		}

		return true
	}
	select_problem(0)

	var commands = {
		help : help,
		list : show_problems_of_lesson,
		problems : show_problems_of_lesson,

		lessons : function()
		{
			print([messages.lessons_pre_execute_message, ""])
			print(map(lessons, function(elem, i)
				{
					return [
						"№ " + i + ".\t" + elem.title + "\n",
						elem.description + "\n"
					]
				}))
			print("")
			print(messages.lessons_post_execute_message, lesson.title)
		},

		lesson : function(index)
		{
			init_lesson(lessons[index])
			print(messages.lesson_post_execute_message)
		},

		show : function(index)
		{
			index = index === undefined ? current_problem_index : index
			var problem = lesson.problems[index]

			print("№ " + index + "." + problem.title + "\n")
			print(problem.description)
			print("\n")
			if(index == current_problem_index)
			{
				current_game.display_in_log()
			}
		},

		start : function(index)
		{
			index = index === undefined ? current_problem_index : index
			var args = slice.call(arguments)
			args[0] = index
			if(select_problem.apply(null, args))
			{
				print(messages.start_title, current_problem_index,
					lesson.problems[current_problem_index].title)
				current_game.display_in_log()
				print(["", messages["start_post_execute_message"], ""])
			}
			else
			{
				print(messages.start_error_message)
				help.start()
			}
		},

		restart : function()
		{
			var args = slice.call(arguments)
			args.unshift(current_problem_index)
			select_problem.apply(null, args)
			current_game.display_in_log()
		},

		state : function()
		{
			current_game.display_in_log()
		},

		move : function()
		{
			if(current_game.game_raw.boat_position == POS_LEFT)
			{
				current_game.to_right.apply(current_game, arguments)
			}
			else
			{
				current_game.to_left.apply(current_game, arguments)
			}
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
		setTimeout(function()
			{
				print(messages["init_globals_message"])
			}, 2000)
	}


	var init_messages = function(msgs) {
		messages = msgs
		for(var i in commands)
		{
			if(commands.hasOwnProperty(i))
			{
				commands.help[i] = commands[i].help = curry(commands.help, i)
			}
		}
	}

	var init_lesson = function(lesson1)
	{
		lesson = lesson1
		select_problem(0)
	}

	var init_lessons = function(lessons1)
	{
		lessons = lessons1
		init_lesson(lessons[0])
	}

	return {
		init_global_commands : init_global_commands,
		init_messages :        init_messages,
		init_lesson :          init_lesson,
		init_lessons :         init_lessons
	}
})();

(function(){
	var help_messages = {
		init_globals_message: ["\n\nMышкой можно растянуть окно консоли, чтобы сделать его повыше, чтобы удобнее было читать текст.\n", "Для начала наберите команду help()"],
		help : "help() - вывести эту справку; help.command() или command.help() - вывести справку по конкретной команде",
		help_main: ["Для того, чтобы посмотреть список задач текущего урока, наберите list() или problems().\n", "Ну а вообще, доступны следующие команды:\n"],
		help_full: [
			"Команда help() применённая к другой команде выводит справку по ней",
			"Примеры:",
			"\thelp.list()",
			"\tlist.help()",
			"\thelp.to_left()",
			"\thelp.help()"],
		help_post_execute_message: "\nВ общем, набирайте команду list().\n",

		list: "вывести список задач",
		list_full: ["Команда problems() или list() выводит список имеющихся задач, выбранного урока. Вызывается без параметров.",
			"Пример:", "\tlist()"],

		lessons: "отобразить список уроков",
		lessons_pre_execute_message: "Список уроков:",
		lessons_post_execute_message: function(current_lesson_title) {
			return ["Набирайте команду lesson(N), где N - это номер выбранного урока.",
				"В данный момент выбран урок \"" + current_lesson_title + ".\""]
		},

		lesson: "выбрать нужный урок",
		lesson_post_execute_message: ["Вы выбрали новый урок.", "Наберите команду problems(), чтобы посмотреть задачи этого урока"],

		problems: "вывести список задач",
		problems_full: ["Команда problems() или list() выводит список имеющихся задач, выбранного урока. Вызывается без параметров.",
			"Пример:", "\tproblems()"],
		problems_post_execute_message: function(current_problem_index){
			return ["Если нравится какая-то задача, набирайте start(N), где N - это номер вашей задачи.",
				"В данный момент выбрана задача № " + current_problem_index + ".\n",
				"Решили все задачи этого урока? Набирайте команду lessons(), чтобы выбрать другой урок.\n"]
		},
		problems_post_execute_message_for_other_lesson: function(displaying_lesson_index, current_lesson_title)
		{
			return ["Если нравятся задачи этого урока, набирайте lesson("
				+ displaying_lesson_index + "), а затем start(N).\n",
				"В данный момент выбран урок \"" + current_lesson_title + "\".\n"]
		},

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
		start_title: function(index, title)
		{
			return "Выбрана задача № " + index + ". " + title + "\n"
		},
		start_post_execute_message: "Наберите команду show(), чтобы прочитать условие задачи",
		start_error_message: "Что-то пошло не так!\n",

		restart: "начать решать текущую задачу заново",
		restart_full: ["Команда restart() сбрасывает все ваши действия и вы начинаете решать задачу заново. Команда restart() вызывается без аргументов"],

		state: "отобразить состояние текущей задачи",
		state_full: ["Команда state() вызывается без аргументов и отображает состояние текущей игры. Показывает, где какой участник расположен: на лодке или на одном из берегов.",
			"Формат отображения следующий:",
			"[левый берег] -- [лодка] ~~~~~~~~~~~~~~ [правый берег]\t - если лодка на левом берегу",
			"[левый берег] ~~~~~~~~~~~~~~ [лодка] -- [правый берег]\t - если лодка на правом берегу",
			"Примеры:",
			"\tstate() \t -> \t [волк, капуста] ~~~~~~~~~~~~~~ [] -- [коза, лодочник]"],

		move: "move(\"волк, коза, капуста\") - переправить перечисленных участников с берега, где стоит лодка, на противоположный",
		move_full: "move(\"волк, коза, капуста\") - переправить перечисленных участников с берега, где стоит лодка, на противоположный"
	}


	infrastructure.init_messages(help_messages)
})();




//==========================================================================

//------- Problems ---------

//==========================================================================
(function(){
	var drawers = drawing_infrastructure.drawers

	var lesson1 = {
		title : "Переправы от Шаповаловых (Квантик № 3, 2014)",
		description : ["Все знают задачу про перевозку волка, козы и капусты. В первый раз она производит большое впечатление. Ведь казалось, что невозможно, и вдруг - вот способ! И всё так наглядно: можно взять фигурки и подвигать их, а то и поиграть: ты будешь козой, ты волком, ты крестянином...",
				"Подборки задач на переправу пользуются популярностью. Но вот список сюжетов в них очень небольшой: два мальчика и полк солдат, рыцари и оруженосцы (или дамы сердца), миссионеры и каннибалы (или купцы и разбойники), переход через мост с фонариком. Для каждого сюжета есть 2-3 задачи. Мало!",
				"Тогда я решил придумать сам. С первой задачей помог сын, вспомнив, как мы переезжали на новую квартиру и грузчиков не хватало. Оказалось, что в такие задачи можно \"зашить\" математику и посерьёзнее. Порешайте и убедитесь в этом сами. Только давайте сразу договоримся: никаких нематематических трюков с выпрыгиванием из лодки, которая не пристала к берегу. А лодку, приставшую к берегу, будем считать частью этого берега.",
				"\n\ttrtg.org: Сюда не вошла задача № 10 из статьи, так как наша программка не умеет моделировать телепорт, где берега взаимно обмениваются героями, не задействуя лодку."],

		problems : [
			{
				title : "Стиральная машина",
				description : ["Три человека со стиральной машиной хотят переправиться через реку. Катер вмещает либо двух человек и стиральную машину, либо трёх человек. Беда в том, что стиральная машина тяжёлая, поэтому погрузить её в катер или вытащить из него можно только втроём. Смогут ли они переправиться?",
					"\n\tКомандой move() возите героев туда-сюда.",
					"\tПример:",
					"\t\tmove(\"чел, чел, стиралка\")"],
				config : (function stiralnaya_mashina(){
					var muzhik = ["чел"]
					var stiralka = ["стиралка"]
					return {
						left: [muzhik, muzhik, muzhik, stiralka],
						boat_capacity: 3,
						boat_moving_rules: necessary(muzhik),
						transaction_rules: {"стиралка": necessary_at_least(muzhik, 3)},
						drawers: {
							"чел": drawers.man(1),
							"стиралка": drawers.rectangle(1, 1)
						},
						colors: {
							"чел": "black",
							"стиралка": "blue",
						}
					}
				})()
			},{
				title : "Три жулика и шесть чемоданов",
				description : ["Три жулика, каждый с двумя чемоданами, находятся на одном берегу реки, через которую они хотят переправиться. Есть трёхместная лодка, каждое место в ней может быть занято либо человеком, либо чемоданом. Никто из жуликов не доверит свой чемодан спутникам в своё отсутствие, но готов оставить чимоданы на безлюдном берегу. Смогут ли они переправиться?",
					"\n\tКомандой move() возите героев туда-сюда.",
					"\tж - жулик, ч - чемодан.",
					"\tПример:",
					"\t\tmove(\"ж-1, ж-2, ч-1\")"],
				config : (function tri_zhulika(){
					var zhul = function(index){return ["ж", index]}
					var chem = function(index){return ["ч", index]}
					return {
						left: [zhul(1), chem(1), chem(1),
							zhul(2), chem(2), chem(2),
							zhul(3), chem(3), chem(3)],
						boat_capacity: 3,
						rules: items_rule(or(needs(["ч", "i"], ["ж", "i"]), afraids(["ч", "i"], ["ж", "j"]))),
						boat_moving_rules: necessary(["ж"]),
						drawers: {
							"ч": drawers.rectangle(1, 1),
							"ж": drawers.man(1)
						},
						colors: {
							1: "green",
							2: "blue",
							3: "black"
						}
					}
				})()
			},{
				title : "Две семьи (a)",
				description : ["Две семьи (в каждой папа, мама и дочь) хотят переправиться через реку. Есть двухместная лодка. Грести могут только мужчины. Дочери могут быть на берегу или в лодке только вместе с кем-нибудь из своих родителей. Как им всем переправиться на другой берег?",
					"\n\tКомандой move() возите героев туда-сюда.",
					"\tf - папа, m - мама, d - дочь",
					"\tПример:",
					"\t\tmove(\"f-1, d-1\")"],
				config : (function dve_semyi_a(){
					//var zhul = function(index){return ["ж", index]}
					//var chem = function(index){return ["ч", index]}
					return {
						left: [["f", 1], ["m", 1], ["d", 1],
							["f", 2], ["m", 2], ["d", 2]],
						boat_capacity: 2,
						rules: items_rule(or(needs(["d", "i"], ["f", "i"]), needs(["d", "i"], ["m", "i"]))),
						boat_moving_rules: necessary(["f"]),
						drawers: {
							"f": drawers.man(1),
							"m": drawers.woman(1),
							"d": drawers.woman(.6)
						},
						colors: {
							1: "green",
							2: "blue"
						}
					}
				})()
			},{
				title : "Две семьи (б)",
				description : ["Задача почти как предыдущая с одним дополнением.\nДве семьи (в каждой папа, мама и дочь) хотят переправиться через реку. Есть двухместная лодка. Грести могут только мужчины. Дочери могут быть на берегу или в лодке только вместе с кем-нибудь из своих родителей, а никакую из женщин нельзя оставлять на берегу одну. Как им всем переправиться на другой берег?",
					"\n\tКомандой move() возите героев туда-сюда.",
					"\tf - папа, m - мама, d - дочь",
					"\tПример:",
					"\t\tmove(\"f-1, d-1\")"],
				config : (function dve_semyi_b(){
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
						boat_moving_rules: necessary(["f"]),
						drawers: {
							"f": drawers.man(1),
							"m": drawers.woman(1),
							"d": drawers.woman(.6)
						},
						colors: {
							1: "green",
							2: "blue"
						}
					}
				})()
			},{
				title : "Две семьи с сыновьями",
				description : ["Две семьи (в каждой муж, жена и сын) хотят переправиться через реку. Есть двухместная лодка. Грести может всего один человек - один из мужей. Сыновья могут быть на берегу только с кем-нибудь из взрослых. Женщины боятся быть на берегу, если там нет лиц мужского пола. Как им всем переправиться на другой берег?",
					"\n\tКомандой move() возите героев туда-сюда.",
					"\tf - папа, m - мама, s - сын",
					"\tПример:",
					"\t\tmove(\"f-1, s-1\")"],
				config : (function dve_semyi_s(){
					return {
						left: [["f", 1], ["m", 1], ["s", 1],
							["f", 2], ["m", 2], ["s", 2]],
						boat_capacity: 2,
						rules: items_rule(and(
								or(
									needs(["s"], ["f"]),
									needs(["s"], ["m"])
								),
								or(
									needs(["m"], ["f"]),
									needs(["m"], ["s"])
								)
							)),
						boat_moving_rules: necessary(["f", "1"]),
						drawers: {
							"f": drawers.man(1),
							"m": drawers.woman(1),
							"s": drawers.man(.6)
						},
						colors: {
							1: "green",
							2: "blue"
						}
					}
				})()
			}, {
				title : "Царевна Соня и 7 богатырей",
				description : ["К переправе подошли царевна Соня и строй из 7 богатырей. Лодка одна, в ней могут плыть двое или трое (в одиночку плыть нельзя). Каждый согласен плыть только вдвоём с другом или втроём с двумя друзьями. Какое наибольшее число из них сможет переправиться, если каждые двое рядом стоящих богатырей - друзья, Соня дружит с ними вместе, кроме среднего из богатырей, а все остальные пары не дружат?",
					"\n\tКомандой move() возите героев туда-сюда.",
					"\tb - богатырь, s - Соня",
					"\tПример:",
					"\t\tmove(\"b1, s\")"],
				config : (function tsarevna_sonya(){
					var s = ["s"]
					var b1 = ["b1"], b2 = ["b2"], b3 = ["b3"],
						b4 = ["b4"],
						b5 = ["b5"], b6 = ["b6"], b7 = ["b7"];

					return {
						left: [s, b1, b2, b3, b4, b5, b6, b7],
						boat_capacity: 3,
						boat_moving_rules: and(
							//Правила минимального количества
							necessary_at_least(2),
							//Правила дружбы
							items_rule(and(
								afraids(s, b4),
								afraids(b1, b3),
								afraids(b1, b4),
								afraids(b1, b5),
								afraids(b1, b6),
								afraids(b1, b7),
								afraids(b2, b4),
								afraids(b2, b5),
								afraids(b2, b6),
								afraids(b2, b7),
								afraids(b3, b6),
								afraids(b3, b7),
								afraids(b4, b6),
								afraids(b4, b7),
								afraids(b5, b7)
							))
						),
						drawers: {
							"b1": drawers.man(1),
							"b2": drawers.man(1),
							"b3": drawers.man(1),
							"b4": drawers.man(1),
							"b5": drawers.man(1),
							"b6": drawers.man(1),
							"b7": drawers.man(1),
							"s": drawers.woman(.7)
						},
						colors: {
							"s": "blue",
						}
					}
				})()
			}, {
				title : "Три вора",
				description : ["Три вора - Камнев, Ножницын и Бумагин, каждый с несколькими баулами, - хотят переправиться через реку. Известно, что Камнев обворует любой баул Ножницына, если баул останется без присмотра кого-нибудь из остальных. Так же Ножницын обворует баул Бумагина, а Бумагин - баул Камнева. Есть трёхместная лодка, место занимает человек или баул. Грести может только Камнев. Как им всем переправиться и перевезти баулы, чтобы никто никого не обворовал?\n(На пустынном берегу баулы в безопасности)",
					"\n\tКомандой move() возите героев туда-сюда.",
					"\tK - Камнев, N - Ножницын, B - Бумагин",
					"\tbk - баул Камнева, bk - баул Ножницына, bb - баул Бумагина",
					"\tПример:",
					"\t\tmove(\"bk, K\")",
					"\n\tТакже вы можете стартовать задачу с разным количеством баулов:",
					"\t\trestart(1, 10, 3)",
					"\tгде первое число - количество баулов Камнева, второе - Ножницына, третье - Бумагина."],
				config : function tri_vora(k_num, n_num, b_num){
					k_num = k_num === undefined ? 2 : k_num
					n_num = n_num === undefined ? 3 : n_num
					b_num = b_num === undefined ? 4 : b_num
					
					var b = function(type){return function(){return [type]}}
					var bk = b("bk")
					var bn = b("bn")
					var bb = b("bb")
					var vk = b("K")()
					var vn = b("N")()
					var vb = b("B")()
					var bkk = bk()
					var bnn = bn()
					var bbb = bb()

					var arr_gen = (function(num, gen)
					{
						var result = []
						for(var i = 0; i < num; ++i)
						{
							result.push(gen())
						}
						return result
					})

					return {
						left: [vk].concat(arr_gen(k_num, bk))
							.concat([vn]).concat(arr_gen(n_num, bn))
							.concat([vb]).concat(arr_gen(b_num, bb)),
						boat_capacity: 3,
						rules: items_rule(and(
								or(
									needs(bkk, vk),
									needs(bkk, vn),
									afraids(bkk, vb)
									),
								or(
									needs(bnn, vn),
									needs(bnn, vb),
									afraids(bnn, vk)
									),
								or(
									needs(bbb, vb),
									needs(bbb, vk),
									afraids(bbb, vn)
									)
							)),
						boat_moving_rules: necessary(vk),
						drawers: {
							"bk": drawers.rectangle(1, 1),
							"bb": drawers.rectangle(1, 1),
							"bn": drawers.rectangle(1, 1),
							"K": drawers.man(1),
							"N": drawers.man(1),
							"B": drawers.man(1)
						},
						colors: {
							"bk": "black",
							"bb": "green",
							"bn": "blue",
							"K": "black",
							"N": "green",
							"B": "blue"
						}
					}
				}
			}, {
				title : "Дон Кихот и все-все-все",
				description : ["К переправе подошли Дон Кихот и Санчо Панса с жёнами, а также несколько монахинь. Есть двухместная лодка, грести могут только Санчо и его жена. Никто из женщин не желает оказаться на берегу в одиночистве. Правила этикета запрещают женщинам быть в лодке или на берегу с другими мужчинами, если рядом нет мужа или другой женщины. При каком числе монахинь все они смогут переправиться? (Несколько - это больше одной)",
					"\n\tКомандой move() возите героев туда-сюда.",
					"\tD - Дон Кихот, d - жена дона Кихота,",
					"\tS - Санчо Панса, s - жена Санчо Пансы,",
					"\tm - монахиня,",
					"\tПример:",
					"\t\tmove(\"bk, K\")",
					"\n\tТакже вы можете стартовать задачу с разным количеством монахинь:",
					"\t\trestart(5)"
					],
				config : function don_kihot(num_of_nuns)
				{
					num_of_nuns = num_of_nuns && num_of_nuns > 1
						? num_of_nuns
						: 5

					var b = function(type){return function(){return [type]}}
					var m = b("m") // генератор монахинь
					var D = ["D"] // Дон Кихот
					var d = ["d"] // его жена
					var S = ["S"] // Санчо Панса
					var s = ["s"] // Его жена
					var mm = m() // монахиня (для условий)

					var m_arr = (function(num)
					{
						var result = []
						for(var i = 0; i < num; ++i)
						{
							result.push(m())
						}
						return result
					})(num_of_nuns)

					var w_alone = and(
								//Правила, боязни одиночества женщинами
								needs_at_least(mm, 2),
								needs_at_least(d, 2),
								needs_at_least(s, 2)
							)

					var w_chopornost = and(
								//Правила боязни чужих мужчин.
								or(
									needs(mm, mm),
									needs(mm, d),
									needs(mm, s),
									and(
										afraids(mm, D),
										afraids(mm, S)
										)
									),
								or(
									needs(d, mm),
									needs(d, D),
									needs(d, s),
									afraids(d, S)
									),
								or(
									needs(s, mm),
									needs(s, S),
									needs(s, d),
									afraids(s, D)
									)
							)

					return {
						left: [D, d, S, s].concat(m_arr),
						boat_capacity: 2,
						rules: items_rule(and(
								w_alone,
								w_chopornost
							)),
						boat_rules: items_rule(and(
								w_chopornost
							)),
						boat_moving_rules: or(necessary(S), necessary(s)),
						drawers: {
							"D": drawers.man(1),
							"d": drawers.woman(1),
							"S": drawers.man(.9),
							"s": drawers.woman(.9),
							"m": drawers.woman(.8),
						},
						colors: {
							"D": "blue",
							"d": "blue",
							"S": "orange",
							"s": "orange",
							"m": "black"
						}
					}
				}
			}, {
				title : "Жюри",
				description : ["Председатель жюри на своей машине хочет за три рейса перевезти 9 членов жюри с вокзала в лагерь, где проходит турнир. В машине 4 места для пассажиров, дорога в один конец занимает полчаса. Если в любом месте в лагере, в машине или на вокзале оказывается группа из двух, трёх или четырёх человек, она за полчаса придумывает, соответственно 3, 4 или 5 задач. Группы другого размера неработоспособны (не придумывают ничего), председатель за рулём входит в группу в машине, но если пассажиров четверо, то он им придумывать не мешает. Какое наибольшее число задач может быть придумано жюри и председателем за эти 2,5 часа?\nБольшие группы находящиеся на одном месте, на части делить нальзя, больше членов жюри нет).",
					"\n\tКомандой move() возите героев туда-сюда.",
					"\tP - председатель жюри, j - член жюри.",
					"\tПример:",
					"\t\tmove(\"P, j, j\")"
					],

				config : (function jury()
				{
					var b = function(type){return function(){return [type]}}
					var j = b("j") // генератор членов
					var J = ["P"] // Председатель
					var transaction_time = .5
					var time_limit = 2.5

					return {
						left: [j(), j(), j(), j(),
							j(), j(), j(), j(), j()],
						boat: [J],
						boat_capacity: 5,
						boat_moving_rules: necessary(J),
						transaction_rules: {"P":not(true_fun)},
						drawers: {
							"P": drawers.man(.9),
							"j": drawers.man(1)
						},
						colors: {
							"P": "blue",
							"j": "red"
						},
						score_counter: function(result, game)
						{
							if(result === false)
								return

							var spent_time = game.jury_spent_time || 0
							if(spent_time >= time_limit)
								return;

							game.jury_spent_time = spent_time + transaction_time
							var what = result.transaction_what
							var to = result.transaction_to
							var from = result.transaction_from

							var get_score = function(len, is_car)
							{
								return len == 2 ? 3
									: len == 3 ? 4
									: len == 4 ? 5
									: len == 5 && is_car ? 5
									: 0
							}

							game.score += get_score(what.length, true)
								+ get_score(to.length, false)
								+ get_score(from.length, false)
						},
						print_score: function(game)
						{
							game.print_fun("Задач: " + game.score
								+ ", время: " + game.jury_spent_time
								+ " из " + time_limit)
						},
						win_rules: function(game)
						{
							return (game.jury_spent_time >= time_limit) && "Время вышло!"
						}
					}
				})()
			}, {
				title : "Мебель",
				description : ["Трём братьям надо перевезти с одной квартиры на другую рояль весом 250 кг, диван весом 100 кг и более 100 коробок по 50 кг. Был нанят небольшой фургон с шофёром на 5 рейсов туда (и 4 обратно), который может за раз перевезти 500 кг груза и одного пассажира. Погрузить или выгрузить диван братья могут вдвоём, рояль - втроём, с коробками любой из братьев справляется в одиночку. Надо перевезти всё мебель и как можно больше коробок. Какое наибольшее число коробок удастся перевезти? (Шофёр не грузит, другого транспорта и помощников нет, пассажиров вместо груза везти нельзя",
					"\n\tКомандой move() возите героев туда-сюда.",
					"\tS - шофёр, B - брат, r - рояль, d - диван.",
					"\tКоробки не указаны, они грузятся и учитываются атоматически",
					"\tПример:",
					"\t\tmove(\"S, B, r\")"
					],

				config : (function divan_i_royal()
				{
					var g = function(type){return function(){return [type]}}
					var b = g("B") // генератор братьев
					var S = ["S"] // Шофёр
					var d = ["d"] // диван
					var r = ["r"] // рояль
					var bb = b() // брат для правил
					var steps_limit = 9
					var korob_weight = 50
					var boat_capacity = 500

					return {
						left: [b(), b(), b(), d, r],
						boat: [S],
						boat_capacity: boat_capacity,
						boat_moving_rules: and(
								necessary(S),
								items_rule(afraids(bb, bb))
							),
						transaction_rules: {
							d: necessary_at_least(bb, 2),
							r: necessary_at_least(bb, 3),
							S: not(true_fun)
						},
						types_weights: {
							B: 0,
							S: 0,
							r: 250,
							d: 100
						},
						drawers: {
							"B": drawers.man(.8),
							"S": drawers.man(1),
							"d": drawers.rectangle(1, 1.4),
							"r": drawers.rectangle(1, 2)
						},
						colors: {
							"S": "gray",
							"B": "blue",
							"r": "black",
							"d": "orange"
						},

						score_counter: function(result, game)
						{
							if(result === false)
								return
							
							var steps = game.divan_i_royal_steps || 0
							if(steps >= steps_limit)
								return;

							game.divan_i_royal_steps = steps + 1
							var what = result.transaction_what
							var to = result.transaction_to
							var from = result.transaction_from
							var is_forward = result.from_boat_position == POS_LEFT
							var weight_what = result.weight_what

							var can_move_korobs = has_object(what, bb)
								|| has_object(from, bb) && has_object(to, bb)

							if(is_forward && can_move_korobs)
							{
								game.score += (boat_capacity - weight_what) / 50
							}
						},
						print_score: function(game)
						{
							game.print_fun("Коробок: " + game.score
								+ ", рейсов: " + game.divan_i_royal_steps
								+ " из " + steps_limit)
						},
						win_rules: function(game)
						{
							return (game.divan_i_royal_steps >= steps_limit) && "Время аренды вышло!"
						}
					}
				})()
			}
		]
	}








	var lesson2 = {
		title : "Переправы (http://www.ashap.info/Zadachi/Perepravy-ch.html)",
		description : ["Подборка не моих задач на переправу (но все они встречались в моих книжках или занятиях). Порешайте. \nТолько не надо трюков с выпрыгиванием пассажира на берег. Помните о такой договорённости: из подошедшей к берегу лодке все должны выйти на берег, даже тот, кто собирается плыть обратно.",
			"\n\ttrtg.org: Сюда не вошла задача № 7-б оригинальной подборки, так как наша программка не умеет моделировать остров посередине реки."],

		problems : [
			{
				title : "Волк, коза и капуста",
				description : ["Классическая задача. Если лодочник уплыл, то волк ест козу, или коза ест капусту. В лодку помещается не более двух персонажей, а грести умеет только лодочник. Как всем переправиться?",
					"\n\tКомандой move() возите героев туда-сюда.",
					"\tПример:",
					"\t\tmove(\"лодочник, волк\")"],
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
						boat_moving_rules: necessary(muzhik),
						drawers: {
							"лодочник": drawers.man(1),
							"волк": drawers.rectangle(1, 1),
							"коза": drawers.triangle(1),
							"капуста": drawers.triangle(.5)
						},
						colors: {
							"лодочник": "blue",
							"капуста": "green",
							"коза": "gray",
							"волк": "black"
						},
						colors_of_heroes: ["blue", "black", "green", "gray"]
					}
				})()
			},{
				title : "Крестьянин с двумя волками, собакой и козой",
				description : ["Крестьянин с двумя волками, собакой, козой и мешком капусты подошел к реке. Ему надо переправиться на другой берег, однако лодка трехместная, каждое место занимает человек, животное или мешок капусты. Нельзя оставлять без присмотра волка с козой или собакой, собаку – с козой, а козу – с капустой. Как крестьянину переправиться без потерь?",
					"\n\tКомандой move() возите героев туда-сюда.",
					"\tK - крестьянин, ko - коза, ka - капуста, V - волк, s - собака",
					"\tПример:",
					"\t\tmove(\"V, V, K\")"],
				config : (function dva_volka(){
					return {
						left: [["K"], ["V"], ["V"], ["s"], ["ko"], ["ka"]],
						boat_capacity: 3,
						rules: or(
								necessary(["K"]),
								items_rule(and(
									afraids(["ka"], ["ko"]),
									afraids(["ko"], ["s"]),
									afraids(["ko"], ["V"]),
									afraids(["s"], ["V"])
								)
							)),
						boat_moving_rules: necessary(["K"]),
						drawers: {
							"K": drawers.man(1),
							"V": drawers.rectangle(1, 2),
							"s": drawers.rectangle(1, 1),
							"ko": drawers.triangle(1),
							"ka": drawers.triangle(.5)
						},
						colors: {
							"K": "blue",
							"V": "grey",
							"s": "brown",
							"ko": "black",
							"ka": "green"
						}
					}
				})()
			},{
				title : "Полк солдат и два мальчика",
				description : ["Полк солдат подошел к реке. По реке катались на лодке два мальчика. Лодка выдерживает одного солдата или двух мальчиков. Как всем солдатам переправиться на другой берег и вернуть лодку мальчикам?",
					"\n\tКомандой restart(5) с параметром можете стартовать с разным количеством солдат.",
					"\tКомандой move() возите героев туда-сюда.",
					"\tS- солдат, b - мальчик",
					"\tПример:",
					"\t\tmove(\"S\")"],
				config : function polk_soldat(num_sold){
					num_sold = num_sold || 5

					var b = function(type){return function(){return [type]}}
					var s = b("S") // генератор солдат
					var b1 = ["b"] // мальчик
					var b2 = ["b"] // мальчик

					var m_arr = (function(num)
					{
						var result = []
						for(var i = 0; i < num; ++i)
						{
							result.push(s())
						}
						return result
					})(num_sold)
					return {
						left: [b1, b2].concat(m_arr),
						boat_capacity: 2,
						types_weights: {
							S: 2,
							b: 1
						},
						drawers: {
							"S": drawers.man(1),
							"b": drawers.man(.7)
						},
						colors: {
							"S": "blue",
							"b": "green"
						}
					}
				}
			},{
				title : "Три мушкетёра",
				description : ["Атос, Портос, Арамис и Д’Артаньян сидели за круглым столом, заспорили, и каждый поссорился со своими двумя соседями. Чтобы ехать дальше, им надо переправиться через реку в двухместной лодке. Каждый из мушкетеров отказывается оставаться вдвоем на берегу или быть в лодке с тем, с кем он в ссоре. Могут ли они все-таки все переправиться?",
					"\n\tКомандой move() возите героев туда-сюда.",
					"\tA - Атос, P - Портос, a - Арамис, D - Д’Артаньян.",
					"\tПример:",
					"\t\tmove(\"V, V, K\")"],
				config : (function tri_mushketera(){
					return {
						left: [["A"], ["P"], ["a"], ["D"]],
						boat_capacity: 2,
						rules: or(
								necessary_at_least(3),
								items_rule(and(
									afraids(["A"], ["P"]),
									afraids(["A"], ["D"]),
									afraids(["a"], ["P"]),
									afraids(["a"], ["D"])
								)
							)),
						drawers: {
							"A": drawers.man(1),
							"P": drawers.man(1),
							"a": drawers.man(1),
							"D": drawers.man(1)
						},
						colors: {
							"A": "black",
							"P": "blue",
							"a": "green",
							"D": "red"
						}
					}
				})()
			},{
				title : "Три туриста",
				description : ["Трое туристов должны перебраться с одного берега реки на другой. В их распоряжении старая лодка, которая может выдержать нагрузку всего в 100 кг. Вес одного из туристов 45 кГ, второго — 50 кГ, третьего — 80 кГ. Как должны они действовать, чтобы перебраться на другой берег?",
					"\n\tКомандой move() возите героев туда-сюда.",
					"\tA - Атос, P - Портос, a - Арамис, D - Д’Артаньян.",
					"\tПример:",
					"\t\tmove(\"V, V, K\")"],
				config : (function tri_turista(){
					return {
						left: [["45"], ["50"], ["80"]],
						boat_capacity: 100,
						types_weights: {
							"45": 45,
							"50": 50,
							"80": 80
						},
						drawers: {
							"45": drawers.man(.5),
							"50": drawers.man(.8),
							"80": drawers.man(1)
						}
					}
				})()
			},{
				title : "Два миссионера и два каннибала",
				description : ["В лодке, вмещающей только двух человек, через реку должны переправиться два миссионера и два каннибала. Миссионеры боятся каннибалов, и хотят всё время быть вдвоём. Как им всем переправиться?",
					"\n\tКомандой move() возите героев туда-сюда.",
					"\tm - миссионер, С - каннибал.",
					"\tПример:",
					"\t\tmove(\"m, m\")"],
				config : (function dva_missionera(){
					return {
						left: [["m"], ["m"], ["C"], ["C"]],
						rules: items_rule(or(
								needs(["m"], ["m"]),
								afraids(["m"], ["C"])
							)),
						boat_capacity: 2,
						colors: {
							"m": "blue",
							"C": "black"
						},
						drawers: {
							"m": drawers.man(.8),
							"C": drawers.man(1)
						}
					}
				})()
			},{
				title : "Три миссионера и три каннибала (a)",
				description : ["В лодке, вмещающей только двух человек, через реку должны переправиться три миссионера и три каннибала. Миссионеры боятся оставаться на каком-нибудь берегу в меньшинстве. Как им всем переправиться?",
					"\n\tm - миссионер, С - каннибал.",
					"\tПример:",
					"\t\tmove(\"m, m\")"],
				config : (function tri_missionera_a(){
					var m = ["m"]
					var c = ["C"]
					return {
						left: [["m"], ["m"], ["m"], ["C"], ["C"], ["C"]],
						rules: or(
								and(
									necessary_at_least(c, 3),
									necessary_at_least(m, 3)
								),
								and(
									not(necessary_at_least(c, 3)),
									necessary_at_least(c, 2),
									necessary_at_least(m, 2)
								),
								not(necessary_at_least(c, 2)),
								items_rule(afraids(m, c))
							),
						boat_capacity: 2,
						colors: {
							"m": "blue",
							"C": "black"
						},
						drawers: {
							"m": drawers.man(.8),
							"C": drawers.man(1)
						}
					}
				})()
			},{
				title : "Три миссионера и три каннибала (б)",
				description : ["В лодке, вмещающей только двух человек, через реку должны переправиться три миссионера и три каннибала. Миссионеры боятся оставаться на каком-нибудь берегу в меньшинстве. Как им всем переправиться, если грести умеют только один миссионер и один каннибал?",
					"\n\tm-1 - гребущий миссионер, С-1 - гребущий каннибал,",
					"\tm-2 - обычный миссионер, C-2 - обычный каннибал,",
					"\tПример:",
					"\t\tmove(\"m, M\")"],
				config : (function tri_missionera_b(){
					var m = ["m"]
					var c = ["C"]
					return {
						left: [["m", 1], ["m", 2], ["m", 2],
								["C", 1], ["C", 2], ["C", 2]],
						rules: or(
								and(
									necessary_at_least(c, 3),
									necessary_at_least(m, 3)
								),
								and(
									not(necessary_at_least(c, 3)),
									necessary_at_least(c, 2),
									necessary_at_least(m, 2)
								),
								not(necessary_at_least(c, 2)),
								items_rule(afraids(m, c))
							),
						boat_moving_rules: or(
								necessary(["m", 1]),
								necessary(["C", 1])
							),
						boat_capacity: 2,
						colors: {
							"1": "red",
							"2": "gray"
						},
						drawers: {
							"m": drawers.man(.8),
							"C": drawers.man(1)
						}
					}
				})()
			},{
				title : "Три рыцаря с оруженосцами",
				description : ["Как 3 рыцаря, каждый со своим оруженосцем, могут переправиться через реку на двухместной лодке, если оруженосцы отказываются оставаться с незнакомыми рыцарями без своих хозяев (но могут оставаться на берегу совсем без рыцарей).",
					"\n\tR - рыцарь, o - оруженосец.",
					"\tПример:",
					"\t\tmove(\"R-1, o-1\")"],
				config : (function tri_missionera_b(){
					var R = ["R"]
					var o = ["o"]
					return {
						left: [["R", 1], ["o", 1],
								["R", 2], ["o", 2],
								["R", 3], ["o", 3]],
						rules: items_rule(or(
								needs(["o", "i"], ["R", "i"]),
								afraids(["o", "i"], ["R", "j"])
							)),
						boat_capacity: 2,
						colors: {
							"1": "red",
							"2": "green",
							"3": "blue"
						},
						drawers: {
							"o": drawers.man(.8),
							"R": drawers.man(1)
						}
					}
				})()
			},{
				title : "Четыре рыцаря с оруженосцами",
				description : ["Как 4 рыцаря, каждый со своим оруженосцем, могут переправиться через реку на двухместной лодке, если оруженосцы отказываются оставаться с незнакомыми рыцарями без своих хозяев (но могут оставаться на берегу совсем без рыцарей).",
					"\n\tR - рыцарь, o - оруженосец.",
					"\tПример:",
					"\t\tmove(\"R-1, o-1\")"],
				config : (function tri_missionera_b(){
					var R = ["R"]
					var o = ["o"]
					return {
						left: [["R", 1], ["o", 1],
								["R", 2], ["o", 2],
								["R", 3], ["o", 3],
								["R", 4], ["o", 4]],
						rules: items_rule(or(
								needs(["o", "i"], ["R", "i"]),
								afraids(["o", "i"], ["R", "j"])
							)),
						boat_capacity: 3,
						colors: {
							"1": "red",
							"2": "green",
							"3": "blue",
							"4": "black"
						},
						drawers: {
							"o": drawers.man(.8),
							"R": drawers.man(1)
						}
					}
				})()
			},{
				title : "Два генерала и полковник",
				description : ["К реке подошли два генерала, каждый – с двумя ординарцами, и один полковник с одним ординарцем. В их распоряжении имеется только одна лодка, вмещающая не более двух человек. Плавать никто не умеет, зато грести умеют все. Смогут ли все восемь человек переправиться на противоположный берег реки, если ни генералы, ни полковник не согласны оставлять ни одного из своих ординарцев в присутствии другого генерала или полковника ни в лодке, ни на берегу (приставшая к берегу лодка считается частью берега)?",
					"\n\tG - генерал или полковник, o - ординарец.",
					"\tПример:",
					"\t\tmove(\"G-1, o-1\")"],
				config : (function dva_generala_i_polkovnik(){
					return {
						left: [["G", 1], ["o", 1], ["o", 1],
								["G", 2], ["o", 2], ["o", 2],
								["G", 3], ["o", 3]],
						rules: items_rule(or(
								needs(["o", "i"], ["G", "i"]),
								afraids(["o", "i"], ["G", "j"])
							)),
						boat_capacity: 2,
						colors: {
							"1": "red",
							"2": "green",
							"3": "blue",
							"4": "black"
						},
						drawers: {
							"o": drawers.man(.8),
							"G": drawers.man(1)
						}
					}
				})()
			},{
				title : "Три генерала",
				description : [" К реке подошли три генерала, каждый – с двумя ординарцами. В их распоряжении имеется только одна лодка, вмещающая не более двух человек. Плавать никто не умеет, зато грести умеют все. Смогут ли все девять человек переправиться на противоположный берег реки, если ни один из генералов не согласен оставлять ни одного из своих ординарцев в присутствии другого генерала ни в лодке, ни на берегу (приставшая к берегу лодка считается частью берега)?",
					"\n\tG - генерал, o - ординарец.",
					"\tПример:",
					"\t\tmove(\"G-1, o-1\")"],
				config : (function tri_generala(){
					return {
						left: [["G", 1], ["o", 1], ["o", 1],
								["G", 2], ["o", 2], ["o", 2],
								["G", 3], ["o", 3], ["o", 3]],
						rules: items_rule(or(
								needs(["o", "i"], ["G", "i"]),
								afraids(["o", "i"], ["G", "j"])
							)),
						boat_capacity: 2,
						colors: {
							"1": "red",
							"2": "green",
							"3": "blue",
							"4": "black"
						},
						drawers: {
							"o": drawers.man(.8),
							"G": drawers.man(1)
						}
					}
				})()
			},{
				title : "Два жулика с баулами и стражник с разбойником",
				description : ["Два жулика и стражник с арестованным разбойником встретились на берегу реки. У каждого жулика по два баула. Все они хотят перправиться на другой берег реки. Есть лодка, которая выдержит двух человек или человека с баулом. Никто из жуликов не согласен оставаться с разбойником в отсутствии стражника. Никто из жуликов не оставит свой баул с разбойником без стражника или с другим жуликом (даже и в присутстствии стражника). Как им всем переправиться?",
					"\n\tz - жулик, b - баул, s - стражник, r - разбойник."],
				config : (function dva_zhulika(){
					return {
						left: [["r"], ["s"],
							["z", 1], ["b", 1], ["b", 1],
							["z", 2], ["b", 2], ["b", 2]],
						rules: items_rule(and(
							or(
								needs(["z"], ["s"]),
								afraids(["z"], ["r"])
							),
							or(
								needs(["b", "i"], ["z", "i"]),
								needs(["b"], ["s"]),
								afraids(["b"], ["r"])
							),
							or(
								needs(["b", "i"], ["z", "i"]),
								afraids(["b", "i"], ["z", "j"])
							)
						)),
						boat_capacity: 2,
						boat_moving_rules: or(
							necessary(["r"]),
							necessary(["s"]),
							necessary(["z"])
							),
						colors: {
							"1": "green",
							"2": "blue",
							"s": "red",
							"r": "black"
						},
						drawers: {
							"z": drawers.man(.9),
							"s": drawers.man(1),
							"r": drawers.man(1),
							"b": drawers.rectangle(1, 1)
						}
					}
				})()
			}, {
				title : "Семья с фонариком",
				description : ["Семья (папа, мама, сын и бабушка) ночью подошла к мосту, способному выдержать только двух человек одновременно. По мосту можно двигаться только с фонариком. Известно, что папа может перейти мост в одну сторону за минуту, мама – за две, сын – за пять и бабушка – за десять минут. Если по мосту движутся двое, время перехода определяется более медленным из двоих. Как семье переправиться менее чем за 18 минут? (Фонарик у них один, кидать его нельзя, светить издали тоже нельзя.)",
					"\n\tp - папа, m - мама, s - сын, b - бабушка.",
					"\tПример:",
					"\t\tmove(\"p, m\")"
					],

				config : (function family_and_bridge()
				{
					var b = function(type){return function(){return [type]}}
					var j = b("j") // генератор членов
					var J = ["P"] // Председатель
					var time_limit = 18

					return {
						left: [["p"], ["m"], ["s"], ["b"]],
						boat_capacity: 2,
						drawers: {
							"p": drawers.man(1),
							"s": drawers.man(0.7),
							"m": drawers.woman(1),
							"b": drawers.woman(0.9)
						},
						score_counter: function(result, game)
						{
							if(result === false)
								return

							var spent_time = game.family_spent_time || 0
							if(spent_time >= time_limit)
								return;

							var what = result.transaction_what
							var to = result.transaction_to
							var from = result.transaction_from

							var get_time = function(what)
							{
								return has_object(what, ["b"]) ? 10
									: has_object(what, ["s"]) ? 5
									: has_object(what, ["m"]) ? 2
									: has_object(what, ["f"]) ? 1
									: 0
							}

							game.family_spent_time = spent_time + get_time(what)
							game.score += 1
						},
						print_score: function(game)
						{
							game.print_fun("Рейсов: " + game.score
								+ ", время: " + game.family_spent_time
								+ " из " + time_limit)
						},
						win_rules: function(game)
						{
							return (game.family_spent_time >= time_limit) && "Время вышло!"
						}
					}
				})()
			}
		]
	}

	var lesson3 = {
		title : "Переправы Шаповаловых - остатки сладки (http://www.ashap.info/Zadachi/Perepravy-m.html)",
		description : ["Самую первую из этих задач (про стиральную машину) придумал мой сын Данил, помогая составить мне подборку задач на переправы. Потом и я понял, что потребность в таких задачах велика, и стал придумывать. Оказалось, что придумывать новые сюжеты не так сложно. Результат перед вами. Задачи, правда, в среднем несколько сложнее, чем в другой подборке (http://www.ashap.info/Zadachi/Perepravy-ch.html). Так ведь и придумывались они в основном для соревнований подготовленных школьников, а не рядовых любителей жанра. Десять из этих задач вошли в подборку журнала Квантик",

			"\n\ttrtg.org: Сюда пока не вошла задача № 8-б оригинальной подборки про Али-Бабу, так как в текущей версии нашей программки запись её правил получилась бы очень длинной."
		],

		problems : [
			{
				title : "Четыре человека с сундуком",
				description : ["Четыре человека с сундуком хотят переправиться через реку. Люди весят 45, 50, 60 и 65 кг, сундук – 100 кг. Лодка выдерживает груз не более 200 кг. Сундук можно погрузить в лодку или вытащить из нее только вчетвером. Как им всё-таки всем переправиться, не оставив и сундук?",
					"\n\t45, 50, 60, 65 - люди,",
					"\tS - сундук",
					"\tКомандой move() возите героев туда-сюда.",
					"\tПример:",
					"\t\tmove(\"45, S\")"],
				config : (function sunduk(){
					return {
						left: [["45"], ["50"], ["60"], ["65"], ["S"]],
						boat_capacity: 200,
						transaction_rules: {
							S: necessary_at_least(5)
						},
						types_weights: {
							"45" : 45,
							"50" : 50,
							"60" : 60,
							"65" : 65,
							"S"  : 100
						},
						boat_moving_rules: or(
							necessary_at_least(2),
							not(necessary("S"))
						),
						drawers: {
							"65": drawers.man(1),
							"60": drawers.man(.9),
							"50": drawers.man(.8),
							"45": drawers.man(.7),
							"S": drawers.rectangle(1, 1)
						}
					}
				})()
			},{
				title : "Канатная дорога",
				description : ["К кабинке канатной дороги на гору подошли четверо с весами 50, 60, 70 и 90 кг. Смотрителя нет, а в автоматическом режиме кабинка ходит туда-сюда только с грузом от 100 до 250 кг ( в частности, пустой не ходит), при условии, что пассажиров можно рассадить на две скамьи так, чтобы веса на скамьях отличались не более, чем на 25 кг. Как им всем подняться на гору?",
					"\n\tКомандой move() возите героев туда-сюда.",
					"\tПример:",
					"\t\tmove(\"50, 60\")"],
				config : (function kanatka(){
					return {
						left: [["50"], ["60"], ["70"], ["90"]],
						boat_capacity: 250,
						types_weights: {
							"50" : 50,
							"60" : 60,
							"70" : 70,
							"90" : 90
						},
						boat_moving_rules: and(
							necessary_at_least(2),
							or(
								and(
									not(necessary_at_least(3)),
									items_rule(afraids(["50"], ["90"])),
									items_rule(afraids(["60"], ["90"]))
								),
								and(
									not(necessary_at_least(4)),
									necessary_at_least(3),
									not(necessary(["70"]))
								),
								necessary_at_least(4)
							)
						),
						drawers: {
							"90": drawers.man(1),
							"70": drawers.man(.9),
							"60": drawers.man(.8),
							"50": drawers.man(.7)
						}
					}
				})()
			},{
				title : "Торговцы с самураем",
				description : ["Несколько торговцев с охраняющим их самураем подошли к переправе. Есть двухместная лодка. Но торговцы самурая побаиваются, им неприятно оставаться с ним один на один в лодке или на берегу. При каком наименьшем числе торговцев всей группе удастся переправится, избежав неприятных ситуаций?",
					"\n\tt - торговцы,",
					"\ts - самурай",
					"\tКомандой move() возите героев туда-сюда.",
					"\tПример:",
					"\t\tmove(\"t, t\")",
					"\tВызывая команду restart() с параметром, вы можете запускать игру с разным количеством торговцев.",
					"\tПример:",
					"\t\trestart(4)"],
				config : function samurai(num_torg){
					num_torg = num_torg || 1

					var arr = []
					for(var i = 0; i < num_torg; ++i)
					{
						arr.push(["t"])
					}
					arr.push(["s"])
					return {
						left: arr,
						boat_capacity: 2,
						rules: or(
							necessary_at_least(3),
							items_rule(afraids(["t"], ["s"]))
						),
						drawers: {
							"t": drawers.man(.7),
							"s": drawers.man(1)
						}
					}
				}
			}
		]
	}

	infrastructure.init_lessons([lesson2, lesson1, lesson3])
})()


infrastructure.init_global_commands();


})()