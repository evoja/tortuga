var ParamsUtil = {
	getUriParams : function()
	{
		return decodeURIComponent(location.search == "" ? "" : location.search.substring(1));
		// try
		// {
		// 	return JSON.parse(decodeURIComponent(location.search.substring(1)));
		// }
		// catch(e)
		// {
		// 	return null;
		// }
	}
}