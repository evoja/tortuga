ns("Tortuga");

(function()
{
	var appendClass = Om.appendClass
	var removeClass = Om.removeClass

	var CL_HIDDEN = "hidden"
	var CL_POINTER = "pointer"
	var CL_OPAQUE = "opaque"

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
		o.underHelpDivs.forEach(function(item)
		{
			appendClass(item, CL_OPAQUE);
		})

		o.helpDivs.forEach(function(item)
		{
			removeClass(item, CL_HIDDEN);
		})

		o.helpButtons.forEach(createForEachHandler(funs.hideHelp, o))
	}

	funs.hideHelp = function(o)
	{
		o.underHelpDivs.forEach(function(item)
		{
			removeClass(item, CL_OPAQUE);
		})

		o.helpDivs.forEach(function(item)
		{
			appendClass(item, CL_HIDDEN);
		})

		o.helpButtons.forEach(createForEachHandler(funs.showHelp, o))
	}

	Tortuga.initHelp = function(helpButtons, helpDivs, underHelpDivs){
		funs.hideHelp({
			helpButtons:helpButtons,
			helpDivs:helpDivs,
			underHelpDivs:underHelpDivs
		})
	}
})();