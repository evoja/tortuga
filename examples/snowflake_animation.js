
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









var stick = function(t, size, n, angle, proportion)
{
	if(n <= 0)
	{
		t.tailDown().go(size).go(-size).tailUp()
	}
	else
	{
		var prop_size = size * proportion
		var anti_prop_size = size - prop_size
		stick(t, prop_size, n - 1, angle, proportion)
		t.go(prop_size)
		t.rotate(angle)
		stick(t, anti_prop_size, n - 1, angle, proportion)
		t.rotate(-angle)
		stick(t, anti_prop_size, n - 1, angle, proportion)
		t.rotate(-angle)
		stick(t, anti_prop_size, n - 1, angle, proportion)
		t.rotate(angle)
		t.go(-prop_size)
	}
}

var snowflake = function(t, size, n, angle, proportion)
{
	repeat(6)
		stick(t, size, n, angle, proportion)
		t.rotate(60)
	end()
}

var redraw_snowflake = function(params)
{
	clearCanvas()
	params.t.rotate(params.rotation)
	snowflake(params.t, params.size, params.n, params.angle, params.proportion)
	params.t.rotate(-params.rotation)
}






var my_params = {
	t: createTortoise(),
	size: 0,
	n: 0,
	angle: 60,
	proportion: 1,
	rotation: 0
}

var my_steps = [
	{
		animation_params: [
			{param_name: "size", target: 0},
			{param_name: "n", target: 0},
			{param_name: "angle", target: 60},
			{param_name: "proportion", target: 1},
			{param_name: "rotation", target: 0}
		],
		time: 0
	},

	{
		animation_params:[
			{param_name: "size", target: 200}
		],
		time: 700
	},

	{
		animation_params:[
			{param_name: "n" , target: 1}
		],
		time: 0
	},

	{
		animation_params: [
			{param_name: "proportion", target: 0.6}
		],
		time: 700
	},

	{
		animation_params: [
			{param_name: "n", target: 4}
		],
		time: 700
	},

	{
		animation_params: [
			{param_name: "rotation", target: 120},
			{param_name: "size", target:100}
		],
		time: 700
	},

	{
		animation_params: [
			{param_name: "rotation", target: 240},
			{param_name: "size", target:200}
		],
		time: 700
	},

	{
		animation_params: [
			{param_name: "proportion", target: 0.2},
		],
		time: 500
	},

	{
		animation_params: [
			{param_name: "proportion", target: 0.9},
		],
		time: 700
	},

	{
		animation_params: [
			{param_name: "proportion", target: 0.6},
		],
		time: 500
	},

	{
		animation_params:[
			{param_name: "angle", target: 0}
		],
		time: 700
	},

	{
		animation_params:[
			{param_name: "angle", target: 180}
		],
		time: 1400
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
	start_steps_processing(my_steps, my_params, timeout_time, redraw_snowflake,
		function()
		{
			start(count - 1, callback)
		})
}


var init = function()
{
	document.onclick = function(){start(3, init); document.onclick = null}
}

init()

alert("Click to start")

