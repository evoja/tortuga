
var iterate = function(params, iteration_params, count, timeout_time, iteration_callback, callback)
{
	if(count <= 0)
	{
		callback()
		return
	}

	for(var i = 0; i < iteration_params.length; ++i)
	{
		var iteration_param = iteration_params[i]
		var param_name = iteration_param.param_name
		var delta = iteration_param.delta
		var target = iteration_param.target
		var new_param_value = params[param_name] + delta;
		
		params[param_name] = delta > 0
				? Math.min(new_param_value, target)
				: Math.max(new_param_value, target)
	}

	iteration_callback(params)

	// setTimeout(function()
	// 	{
	// 		iterate(params, iteration_params, count - 1, timeout_time, iteration_callback, callback)
	// 	},
	// 	timeout_time)
	requestAnimationFrame(function()
		{
			iterate(params, iteration_params, count - 1, timeout_time, iteration_callback, callback)
		})
}


var animate = function(params, animation_params, time, timeout_time, iteration_callback, callback)
{
	var count = time / timeout_time || 1;
	var iteration_params = []
	for(var i = 0; i < animation_params.length; ++i)
	{
		var animation_param = animation_params[i]
		var param_name = animation_param.param_name
		var target = animation_param.target
		var delta = (target - params[param_name]) / count

		var iteration_param = {
			param_name: param_name,
			delta: delta,
			target: target
		}

		iteration_params.push(iteration_param)
	}

	iterate(params, iteration_params, count, timeout_time, iteration_callback, callback)
}


var process_step = function(steps, params, timeout_time, iteration_callback, callback)
{
	if(steps.length == 0)
	{
		callback()
		return
	}

	var step = steps.shift()

	animate(params, step.animation_params, step.time, timeout_time, iteration_callback,
		function(){
			process_step(steps, params, timeout_time, iteration_callback, callback)
		})
}

var start_steps_processing = function(steps, params, timeout_time, iteration_callback, callback)
{
	var clone_of_steps = steps.slice(0)
	process_step(clone_of_steps, params, timeout_time, iteration_callback, callback)
}









var tree = function(t, size, n, angle, part_proportion, side_proportion)
{
	if(n <= 0)
	{
		t.tailDown().go(size).go(-size).tailUp()
	}
	else
	{
		var part_size = size * part_proportion
		var anti_part_size = size - part_size
		var side_size = size * side_proportion
		t.tailDown()
		t.go(part_size)
		tree(t, anti_part_size, n - 1, -angle, part_proportion, side_proportion)
		t.rotate(angle)
		tree(t, side_size, n - 2, angle, part_proportion, side_proportion)
		t.rotate(-angle)
		t.go(-part_size)
	}
}

var redraw_tree = function(params)
{
	begin()
	clearCanvas()
	my_params.bg_t.go(850).go(-850)
	params.t.rotate(params.rotation)
	tree(params.t, params.size, params.n, params.angle,
		params.part_proportion, params.side_proportion)
	params.t.rotate(-params.rotation)
	end()
}






var my_params = {
	t: createTortoise(400, 20, "white"),
	bg_t: createTortoise(0, 200, "black", 450),
	size: 0,
	n: 0,
	angle: 0,
	part_proportion: .25,
	side_proportion: 0.45,
	rotation: 90
}

var my_steps = [
	//reset
	{
		animation_params: [
			{param_name: "size", target: 0},
			{param_name: "n", target: 0},
			{param_name: "angle", target: 0}
		],
		time: 0
	},
	//growing
	{
		animation_params: [
			{param_name: "size", target: 350},
			{param_name: "n", target: 14},
			{param_name: "angle", target: 45}
		],
		time: 3000
	},

	{
		animation_params: [
			{param_name: "angle", target: 40}
		],
		time: 400
	},

	//palm
	{
		animation_params: [
			{param_name: "part_proportion", target: 0.7}
		],
		time: 500
	},

	{
		animation_params: [
			{param_name: "part_proportion", target: 0.65}
		],
		time: 400
	},

	//pine
	{
		animation_params: [
			{param_name: "part_proportion", target: 0.1}
		],
		time: 700
	},

	{
		animation_params: [
			{param_name: "part_proportion", target: 0.13}
		],
		time: 400
	},

	{
		animation_params: [
			{param_name: "part_proportion", target: 0.25}
		],
		time: 400
	},


	//baobab
	{
		animation_params: [
			{param_name: "side_proportion", target: 0.75}
		],
		time: 500
	},

	{
		animation_params: [
			{param_name: "side_proportion", target: 0.70}
		],
		time: 500
	},

	//stick
	{
		animation_params: [
			{param_name: "side_proportion", target: 0.1}
		],
		time: 700
	},

	{
		animation_params: [
			{param_name: "side_proportion", target: 0.45}
		],
		time: 400
	},

	{
		animation_params:[
			{param_name: "angle", target: 345}
		],
		time: 1400
	},


	{
		animation_params:[
			{param_name: "angle", target: 340}
		],
		time: 400
	},

	{
		animation_params:[
			{param_name: "size", target: 0}
		],
		time: 700
	}
]


var start = function(count, callback)
{
	if(count <= 0)
	{
		callback()
		return
	}

	var timeout_time = 1000 / 60;
	start_steps_processing(my_steps, my_params, timeout_time, redraw_tree,
		function()
		{
			start(count - 1, callback)
		})
}

var init = function()
{
	document.onclick = function(){start(3, init); document.onclick = null}
}
my_params.bg_t.tailDown().go(850).go(-850)
init()
setTimeout(function(){alert("Click to start")}, 0)

