var ParamsUtil;

(function()
{
var utf8_to_prezip = function(str)
{
	return unescape(encodeURIComponent( str ))
}

var prezip_to_utf8 = function(str)
{
	return decodeURIComponent(escape(str));
}


var putLessonTextToUriValue = function(text)
{
	return btoa(RawDeflate.deflate(utf8_to_prezip(text)));
}

var getLessonLink = function(lesson)
{
	var value = putLessonTextToUriValue(JSON.stringify(lesson));
	var path = location.pathname.substring(0, location.pathname.lastIndexOf("/")+1);
	return location.origin + location.host + path + "index.html" +
			"?" + value;
}

var getLessonTextFromUriValue = function()
{
	try
	{
		return prezip_to_utf8(RawDeflate.inflate(atob(location.search.substring(1))));
	}
	catch(e)
	{
		return null;
	}
}

var getLesson = function()
{
	var text = getLessonTextFromUriValue();
	console.log(text);
	return JSON.parse(text);
}



ParamsUtil = {
	getLesson : getLesson,
	getLessonLink : getLessonLink
}
})()