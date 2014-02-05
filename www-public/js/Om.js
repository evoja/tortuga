var Om;

(function()
{
var slice = Array.prototype.slice

var isInInUserAgent = function(str)
{
	return navigator.userAgent.indexOf(str) != -1
}

var any = function(arr, cond)
{
	var size = arr.length
	for(var i = 0; i < size; ++i)
	{
		if(cond(arr[i]))
			return true;
	}
	return false;
}

var every = function(arr, cond)
{
	return !any(arr, function(val){return !cond(val)})
}

Om = {
isMac : function(){return isInInUserAgent("Mac")},
isChrome : function(){return isInInUserAgent("Chrome")},
isFirefox : function(){return isInInUserAgent("Firefox")},
isSafari : function(){return isInInUserAgent("Safari")},
isOpera : function(){return isInInUserAgent("Opera")},
isIE : function(versions)
{
	return !versions && isInInUserAgent("MSIE")
		|| versions && any(versions, function(version){return isInInUserAgent("MSIE " + version)});
},

/**
Метод для работы с объектом arguments.
Это такие упрощённые массивы, у которых нету некоторых полезных методов, 
вот и приходится извращаться.
*/
prependArgumentsByObject : function(obj, oargs)
{
	var nargs = slice.apply(oargs)
	nargs.unshift(obj)
	return nargs
},

appendClass : function (elem, className)
{
	elem.classList.add(className)
},

removeClass : function (elem, className)
{
	var old = elem.className;
	var index = old.indexOf(className);
	if(index < 0)
		return;

	var isLast = index + className.length == old.length;
	var isFirst = index == 0;
	var cut = old.substring(0, index) + old.substring(index + className.length);

	if(!isLast)
	{
		cut = cut.substring(0, index) + cut.substring(index + 1);
	}
	if(isLast && !isFirst)
	{
		cut = cut.substring(0, index - 1);
	}
	elem.className = cut;
},


htmlspecialchars : function (str, withoutAmps)
{
	if (typeof(str) == "string")
	{
		if(!withoutAmps)
		{
			str = str.replace(/&/g, "&amp;"); /* must do &amp; first */
		}
		str = str.replace(/"/g, "&quot;");
		str = str.replace(/'/g, "&#039;");
		str = str.replace(/</g, "&lt;");
		str = str.replace(/>/g, "&gt;");
	}
	return str;
},
rhtmlspecialchars : function(str)
{
	if (typeof(str) == "string")
	{
		str = str.replace(/&gt;/ig, ">");
		str = str.replace(/&lt;/ig, "<");
		str = str.replace(/&#039;/g, "'");
		str = str.replace(/&quot;/ig, '"');
		str = str.replace(/&amp;/ig, '&'); /* must do &amp; last */
	}
	return str;
},

utf8_to_b64 : function ( str )
{
    return window.btoa(unescape(encodeURIComponent( str )));
},
b64_to_utf8 : function ( str )
{
    return decodeURIComponent(escape(window.atob( str )));
}
}

})()