// Requires Om.func
Om.ns("Om");

(function()
{
if(Om.func === undefined || Om.logic === undefined)
{
	console.log("Om.func is required")
	return
}

var func = Om.func
var not = Om.logic.not




var is_in_user_agent = function(str)
{
	return navigator.userAgent.indexOf(str) != -1
}

var array_every = Array.prototype.every

var every = function(arr, cond)
{
	return array_every.call(arr, cond)
}

var some = function(arr, cond)
{
	return !every(arr, not(cond))
}

Om.is_mac = function(){return is_in_user_agent("Mac")}
Om.is_chrome = function(){return is_in_user_agent("Chrome")}
Om.is_firefox = function(){return is_in_user_agent("Firefox")}
Om.is_safari = function(){return is_in_user_agent("Safari")}
Om.is_opera = function(){return is_in_user_agent("Opera")}
Om.is_ie = function(versions)
{
	return !versions && is_in_user_agent("MSIE")
		|| (!!versions) && some(versions, function(version){return is_in_user_agent("MSIE " + version)});
}

})()