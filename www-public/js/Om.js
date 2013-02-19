var Om = {}
Om.isMac = function()
{
	return navigator.appVersion.indexOf("Mac")!=-1
}

Om.prependArgumentsByObject = function(obj, oargs)
{
	var size = oargs.length;
	var nargs = [obj];
	for(var j = 0; j < size; ++j)
	{
		nargs.push(oargs[j]);
	}
	return nargs;		
}
