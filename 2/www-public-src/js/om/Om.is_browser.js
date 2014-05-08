// Requires Om.func
Om.ns_run("Om", function(ns)
{
var func = Om.ns_get("Om.func")
var not = Om.ns_get("Om.logic.not")




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

ns.is_mac = function(){return is_in_user_agent("Mac")}
ns.is_chrome = function(){return is_in_user_agent("Chrome")}
ns.is_firefox = function(){return is_in_user_agent("Firefox")}
ns.is_safari = function(){return is_in_user_agent("Safari")}
ns.is_opera = function(){return is_in_user_agent("Opera")}
ns.is_ie = function(versions)
{
	return !versions && is_in_user_agent("MSIE")
		|| (!!versions) && some(versions, function(version){return is_in_user_agent("MSIE " + version)});
}

})