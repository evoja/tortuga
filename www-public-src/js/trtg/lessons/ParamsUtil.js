/**
Вспомогательные функции для работы с адресной строкой
и запрятанными туда уроками.
В частности, кодирование-декодирование.
*/
om.ns_run('trtg.lessons', function(ns)
{

var VERSION_LENGTH = 3;
var CURRENT_VERSION = '001';


var utf8_to_prezip = function(str)
{
    return unescape(encodeURIComponent( str ));
}

var prezip_to_utf8 = function(str)
{
    return decodeURIComponent(escape(str));
};


var putLessonTextToUriValue = function(text)
{
    return btoa(RawDeflate.deflate(utf8_to_prezip(text)));
};

var getLessonLink = function(lesson)
{
    var value = putLessonTextToUriValue(JSON.stringify(lesson));
    var path = location.pathname.substring(0, location.pathname.lastIndexOf('/')+1);
    return location.origin + path + 'index.html' +
            '?' + CURRENT_VERSION + value;
};

var givCurrentVersion = function()
{
    return CURRENT_VERSION;
};

//location.search.substring(1)
var getUriValue = function(url)
{
    var vhozhd = url.indexOf('?');
    var result = url.substr(vhozhd + 1 + VERSION_LENGTH);
    return result;
};

var getLessonTextFromGetUriValue = function(url)
{
    return prezip_to_utf8(RawDeflate.inflate(atob(getUriValue(url))));
};

var getLessonTextFromUriValue = function()
{
    return getLessonTextFromGetUriValue(location.search);
};

var getLesson = function()
{
    try
    {
        var text = getLessonTextFromUriValue();
        if (text!='')
            return JSON.parse(text)
        else
            return 'indexpage';
    }
    catch(e)
    {
        return null;
    }
};



ns.ParamsUtil = {
    getLesson:getLesson,
    getLessonLink:getLessonLink,
    givCurrentVersion:givCurrentVersion,
    getLessonTextFromUriValue:getLessonTextFromUriValue,
    getLessonTextFromGetUriValue:getLessonTextFromGetUriValue
};
});