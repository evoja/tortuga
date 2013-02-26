var Om = {
isMac : function()
{
	return navigator.appVersion.indexOf("Mac")!=-1
},

prependArgumentsByObject : function(obj, oargs)
{
	var size = oargs.length;
	var nargs = [obj];
	for(var j = 0; j < size; ++j)
	{
		nargs.push(oargs[j]);
	}
	return nargs;		
},

getAppendedClassName : function(prevClasses, className)
{
	return (prevClasses ? prevClasses + " " : "") + className
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