var createTortoise;
var initTortoise;

(function(){
	initTortoise = function(tortoiseContainer)
	{
		createTortoise = function(xx, yy, color)
		{
			return new Tortoise(xx, yy, color, tortoiseContainer);
		}
	}

})()