var Om;

(function()
{
var slice = Array.prototype.slice

Om = {
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