ns("Tortuga");
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
	return location.origin + path + "index.html" +
			"?" + value;
}

//location.search.substring(1)
var getUriValue = function(u)
{
	//file:///C:/pathToMyProject/tortuga/www-public/index.html?q1YqySzJSVWyUrqw6cKGC5sudgPJ/UASxNuvpKOUWZKaW6xkFV0NVwiThCmG0UDFxUXJMJOwSaekFicXZRaUZOb
	var str = u;
	var vhozhd = str.indexOf('?');
	var result = str.substr(vhozhd + 1);
	return result;
}

var getLessonTextFromGetUriValue = function(u)
{
	return prezip_to_utf8(RawDeflate.inflate(atob(getUriValue(u))));
}

var getLessonTextFromUriValue = function()
{
	return getLessonTextFromGetUriValue(location.search);
}

var getLesson = function()
{
	try
	{
		var text = getLessonTextFromUriValue();
		return JSON.parse(text);
	}
	catch(e)
	{
		return null;
	}
}



Tortuga.ParamsUtil = {
	                   getLesson : getLesson,
	               getLessonLink : getLessonLink,
	   getLessonTextFromUriValue : getLessonTextFromUriValue,
	getLessonTextFromGetUriValue : getLessonTextFromGetUriValue
}
})()