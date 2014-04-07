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
		this.boat_position = cfg.boat || select_boat_position(this.left, this.right)
		this.score = 0
		this.print_fun = print_fun || function(){}
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

	var print = function(value) 
	{
		var result = prepare_print_string(value)
		if(typeof result == "object" && result.constructor.toString().match("function Array.*"))
		{
			console.log(result.join("\n"))
		}
		else
		{
			console.log(result)
		}
	}

	var print_help = function() {
		print(commands.help.main)
		print()
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

	var select_problem = function(index)
	{
		current_problem_index = index
		var cfg = lesson.problems[index].config
		if(typeof cfg == "function")
		{
			cfg = cfg.apply(null, slice.call(arguments, 1))
		}
		current_game = new Game(new GameRaw(cfg, print))
	}
	select_problem(0)

	var commands = {
		help : function(command)
		{
			if(!command)
			{
				print(messages.help_main)
				print_commands(commands)
			}
			else
			{
				print(messages[command + "_full"])
			}
		},

		list : function()
		{
			var len = lesson.problems.length
			print(map(lesson.problems, function(elem, i)
				{
					return "№ " + i + ".\t" + elem.title
				}))
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
			select_problem.apply(null, args)
		},

		restart : function()
		{
			var args = slice.call(arguments)
			args.unshift(current_problem_index)
			select_problem.apply(null, args)
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

		move: "move(\"волк, коза, капуста\") - переправить перечисленных участников с берега, где стоит лодка, на противоположный",
		move_full: "move(\"волк, коза, капуста\") - переправить перечисленных участников с берега, где стоит лодка, на противоположный"
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
					"\tКомандой move() возите героев туда-сюда.",
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
						boat_moving_rules: necessary(muzhik)
					}
				})()
			},{
				title : "Стиральная машина",
				description : ["Три человека со стиральной машиной хотят переправиться через реку. Катер вмещает либо двух человек и стиральную машину, либо трёх человек. Беда в том, что стиральная машина тяжёлая, поэтому погрузить её в катер или вытащить из него можно только втроём. Смогут ли они переправиться?",
					"\n\tКомандой state() вы отображаете текущее состояние.",
					"\tКомандой move() возите героев туда-сюда.",
					"\tПример:",
					"\t\tmove(\"чел, чел, стиралка\")"],
				config : (function stiralnaya_mashina(){
					var muzhik = ["чел"]
					var stiralka = ["стиралка"]
					return {
						left: [muzhik, muzhik, muzhik, stiralka],
						boat_capacity: 3,
						boat_moving_rules: necessary(muzhik),
						transaction_rules: {"стиралка": necessary_at_least(muzhik, 3)}
					}
				})()
			},{
				title : "Три жулика и шесть чемоданов",
				description : ["Три жулика, каждый с двумя чемоданами, находятся на одном берегу реки, через которую они хотят переправиться. Есть трёхместная лодка, каждое место в ней может быть занято либо человеком, либо чемоданом. Никто из жуликов не доверит свой чемодан спутникам в своё отсутствие, но готов оставить чимоданы на безлюдном берегу. Смогут ли они переправиться?",
					"\n\tКомандой state() вы отображаете текущее состояние.",
					"\tКомандой move() возите героев туда-сюда.",
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
						boat_moving_rules: necessary(["ж"])
					}
				})()
			},{
				title : "Две семьи (a)",
				description : ["Две семьи (в каждой папа, мама и дочь) хотят переправиться через реку. Есть двухместная лодка. Грести могут только мужчины. Дочери могут быть на берегу или в лодке только вместе с кем-нибудь из своих родителей. Как им всем переправиться на другой берег?",
					"\n\tКомандой state() вы отображаете текущее состояние.",
					"\tКомандой move() возите героев туда-сюда.",
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
						boat_moving_rules: necessary(["f"])
					}
				})()
			},{
				title : "Две семьи (б)",
				description : ["Задача почти как предыдущая с одним дополнением.\nДве семьи (в каждой папа, мама и дочь) хотят переправиться через реку. Есть двухместная лодка. Грести могут только мужчины. Дочери могут быть на берегу или в лодке только вместе с кем-нибудь из своих родителей, а никакую из женщин нельзя оставлять на берегу одну. Как им всем переправиться на другой берег?",
					"\n\tКомандой state() вы отображаете текущее состояние.",
					"\tКомандой move() возите героев туда-сюда.",
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
						boat_moving_rules: necessary(["f"])
					}
				})()
			},{
				title : "Две семьи с сыновьями",
				description : ["Две семьи (в каждой муж, жена и сын) хотят переправиться через реку. Есть двухместная лодка. Грести может всего один человек - один из мужей. Сыновья могут быть на берегу только с кем-нибудь из взрослых. Женщины боятся быть на берегу, если там нет лиц мужского пола. Как им всем переправиться на другой берег?",
					"\n\tКомандой state() вы отображаете текущее состояние.",
					"\tКомандой move() возите героев туда-сюда.",
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
						boat_moving_rules: necessary(["f", "1"])
					}
				})()
			}, {
				title : "Царевна Соня и 7 богатырей",
				description : ["К переправе подошли царевна Соня и строй из 7 богатырей. Лодка одна, м ней могут плыть двое или трое (в одиночку плыть нельзя). Каждый согласен плыть только вдвоём с другом или втроём с двумя друзьями. Какое наибольшее число из них сможет переправиться, если каждые двое рядом стоящих богатырей - друзья, Соня дружит с ними вместе, кроме среднего из богатырей, а все остальные пары не дружат?",
					"\n\tКомандой state() вы отображаете текущее состояние.",
					"\tКомандой move() возите героев туда-сюда.",
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
						)
					}
				})()
			}, {
				title : "Три вора",
				description : ["Три вора - Камнев, Ножницын и Бумагин, каждый с несколькими баулами, - хотят переправиться через реку. Известно, что Камнев обворует любой баул Ножницына, если баул останется без присмотра кого-нибудь из остальных. Так же Ножницын обворует баул Бумагина, а Бумагин - баул Камнева. Есть трёхместная лодка, место занимает человек или баул. Грести может только Камнев. Как им всем переправиться и перевезти баулы, чтобы никто никого не обворовал?\n(На пустынном берегу баулы в безопасности)",
					"\n\tКомандой state() вы отображаете текущее состояние.",
					"\tКомандой move() возите героев туда-сюда.",
					"\tK - Камнев, N - Ножницын, B - Бумагин",
					"\tbk - баул Камнева, bk - баул Ножницына, bb - баул Бумагина",
					"\tПример:",
					"\t\tmove(\"bk, K\")"],
				config : (function tri_vora(){
					
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

					return {
						left: [vk, bk(), bk(),
							vn, bn(), bn(), bn(),
							vb, bb(), bb(), bb(), bb()],
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
						boat_moving_rules: necessary(vk)
					}
				})()
			}, {
				title : "Дон Кихот и все-все-все",
				description : ["К переправе подошли Дон Кихот и Санчо Панса с жёнами, а также несколько монахинь. Есть двухместная лодка, грести могут только Санчо и его жена. Никто из женщин не желает оказаться на берегу в одиночистве. Правила этикета запрещают женщинам быть в лодке или на берегу с другими мужчинами, если рядом нет мужа или другой женщины. При каком числе монахинь все они смогут переправиться? (Несколько - это больше одной)",
					"\n\tКомандой state() вы отображаете текущее состояние.",
					"\tКомандой move() возите героев туда-сюда.",
					"\tD - Дон Кихот, d - жена Дона Кихота,",
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
						boat_moving_rules: or(necessary(S), necessary(s))
					}
				}
			}, {
				title : "Жюри",
				description : ["Председатель жюри на своей машине хочет за три рейса перевезти 9 членов жюри с вокзала в лагерь, где проходит турнир. В машине 4 места для пассажиров, дорога в один конец занимает полчаса. Если в любом месте в лагере, в машине или на вокзале оказывается группа из двух, трёх или четырёх человек, она за полчаса придумывает, соответственно 3, 4 или 5 задач. Группы другого размера неработоспособны (не придумывают ничего), председатель за рулём входит в группу в машине, но если пассажиров четверо, то он им придумывать не мешает. Какое наибольшее число задач может быть придумано жюри и председателем за эти 2,5 часа?\nБольшие группы находящиеся на одном месте, на части делить нальзя, больше членов жюри нет).",
					"\n\tКомандой state() вы отображаете текущее состояние.",
					"\tКомандой move() возите героев туда-сюда.",
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
						left: [J, j(), j(), j(), j(),
							j(), j(), j(), j(), j()],
						boat_capacity: 5,
						boat_moving_rules: necessary(J),
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
					"\n\tКомандой state() вы отображаете текущее состояние.",
					"\tКомандой move() возите героев туда-сюда.",
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
						left: [S, b(), b(), b(), d, r],
						boat_capacity: boat_capacity,
						boat_moving_rules: and(
								necessary(S),
								items_rule(afraids(bb, bb))
							),
						transaction_rules: {
							d: necessary_at_least(bb, 2),
							r: necessary_at_least(bb, 3)
						},
						types_weights: {
							B: 0,
							S: 0,
							r: 250,
							d: 100
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

	infrastructure.init_lesson(lesson)
})()


infrastructure.init_global_commands();


})()