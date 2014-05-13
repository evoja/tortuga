om.ns_run('om.text', function(ns)
{

/**
@namespace om.text
@memberof! <global>
@description
Для этих функций существуют всякие стандартные способы разной степени стандартности.

Например, вот я знаю способ через decudeURI component для b64_to_utf8.
А вот для htmlspecialchars я способа не знаю, поэтому написал свой.

Причём, и там, и там могут потом найтись баги и какая-нибудь библиотека-способ получше.

Поэтому я их оборачиваю в свою обёртку, чтобы если мне в конце концов
понравится один способ больше другого, то я заменю этот вызов здесь,
не меняя по всему коду.
*/

ns.htmlspecialchars = function (str, withoutAmps)
{
    if (typeof(str) == 'string')
    {
        if(!withoutAmps)
        {
            str = str.replace(/&/g, '&amp;'); /* must do &amp; first */
        }
        str = str.replace(/"/g, '&quot;');
        str = str.replace(/'/g, '&#039;');
        str = str.replace(/</g, '&lt;');
        str = str.replace(/>/g, '&gt;');
    }
    return str;
}
ns.rhtmlspecialchars = function(str)
{
    if (typeof(str) == 'string')
    {
        str = str.replace(/&gt;/ig, '>');
        str = str.replace(/&lt;/ig, '<');
        str = str.replace(/&#039;/g, "'");
        str = str.replace(/&quot;/ig, '"');
        str = str.replace(/&amp;/ig, '&'); /* must do &amp; last */
    }
    return str;
}

ns.utf8_to_b64 = function ( str )
{
    return window.btoa(unescape(encodeURIComponent( str )));
}
ns.b64_to_utf8 = function ( str )
{
    return decodeURIComponent(escape(window.atob( str )));
}

})