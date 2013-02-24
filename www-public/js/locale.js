ns("Tortuga");
(function()
{
	Tortuga.addOnLocaleLoadedListener = function(handler)
	{
		handler();
	}

	Tortuga.getStr = function(id)
	{
		return id;
	}
})