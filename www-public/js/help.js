ns("Tortuga");

(function()
{
	var appendClass = Om.appendClass
	var removeClass = Om.removeClass

	var CL_HELP_SHOWN = "sideHelp-shown"
	var CL_POINTER = "pointer"

	var falseFun = function(){return false}

	var createForEachHandler = function(fun, o)
	{
		return function(item)
		{
			item.onclick = function(){fun(o)}
			item.onmousedown = falseFun
			appendClass(item, CL_POINTER)
		}
	}


	var funs = {};

	funs.showHelp = function(o)
	{
		o.helpDivs.forEach(function(item)
		{
			appendClass(item, CL_HELP_SHOWN);
		})

		o.helpButtons.forEach(createForEachHandler(funs.hideHelp, o))
	}

	funs.hideHelp = function(o)
	{
		o.helpDivs.forEach(function(item)
		{
			removeClass(item, CL_HELP_SHOWN);
		})

		o.helpButtons.forEach(createForEachHandler(funs.showHelp, o))
	}

	Tortuga.initHelp = function(helpButtons, helpDivs){
		funs.hideHelp({
			helpButtons:helpButtons,
			helpDivs:helpDivs
		})
	}
})();