var ParamsUtil;

(function()
{
var putLessonTextToUriValue = function(text)
{
	return btoa(RawDeflate.deflate(text));
}

var getLessonLink = function(lesson)
{
	var value = putLessonTextToUriValue(lesson);
	var path = location.pathname.substring(0, location.pathname.lastIndexOf("/")+1);
	return location.origin + location.host + path + "index.html" +
			"?" + value;
}

var getLessonTextFromUriValue = function()
{
	try
	{
		return RawDeflate.inflate(atob(location.search.substring(1)))
	}
	catch(e)
	{
		return null;
	}
}

var getLesson = function()
{
	var text = getLessonTextFromUriValue();
	return Om.htmlspecialchars(text, true);
}



ParamsUtil = {
	getLesson : getLesson,
	getLessonLink : getLessonLink
}
})()