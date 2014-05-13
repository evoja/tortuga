/**
 * @namespace om.is_browser
 * @memberof! <global>
*/
om.ns_run('om.is_browser', function(ns)
{
var func = om.ns_get('om.func.func')
var not = om.ns_get('om.func.logic.not')

var is_in_user_agent = function(str)
{
    return navigator.userAgent.indexOf(str) != -1
}

var array_every = Array.prototype.every

var every = function(arr, cond)
{
    return array_every.call(arr, cond)
}

var some = function(arr, cond)
{
    return !every(arr, not(cond))
}

/**
 * @function is_mac
 * @memberof om.is_browser
 * @return {boolean}
 */
ns.is_mac = function(){return is_in_user_agent('Mac')}
/**
 * @function is_chrome
 * @memberof om.is_browser
 * @return {boolean}
 */
ns.is_chrome = function(){return is_in_user_agent('Chrome')}
/**
 * @function is_firefox
 * @memberof om.is_browser
 * @return {boolean}
 */
ns.is_firefox = function(){return is_in_user_agent('Firefox')}
/**
 * @function is_safari
 * @memberof om.is_browser
 * @return {boolean}
 */
ns.is_safari = function(){return is_in_user_agent('Safari')}
/**
 * @function is_opera
 * @memberof om.is_browser
 * @return {boolean}
 */
ns.is_opera = function(){return is_in_user_agent('Opera')}
/**
 * @function is_ie
 * @memberof om.is_browser
 * @param {Array.<string>=} versions - Without argument returns if borwser is IE.
 *   With passed arguments checks if browser one of IE versions.
 * @return {boolean}
 */
ns.is_ie = function(versions)
{
    return !versions && is_in_user_agent('MSIE')
        || (!!versions) && some(versions, function(version){return is_in_user_agent('MSIE ' + version)});
}

})