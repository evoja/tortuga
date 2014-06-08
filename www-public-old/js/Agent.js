/**
Отвечает за отображение информации о том, что нужно нажать,
чтобы открыть консоль браузера.

Определяет, какой именно браузер, на какой операционной системе,
можем ли мы вообще на этом браузере корректно работать.
В соответствии с этим показывает нужное сообщение.
*/

ns("Tortuga");

Tortuga.Agent;

(function()
{
	var any = function(arr, cond)
	{
		var size = arr.length
		for(var i = 0; i < size; ++i)
		{
			if(cond(arr[i]))
				return true;
		}
		return false;
	}

	var every = function(arr, cond)
	{
		return !any(arr, function(val){return !cond(val)})
	}

	var isInInUserAgent = function(str)
	{
		return navigator.userAgent.indexOf(str) != -1
	}

	var isMac = function(){return isInInUserAgent("Mac")}
	var isChrome = function(){return isInInUserAgent("Chrome")}
	var isFirefox = function(){return isInInUserAgent("Firefox")}
	var isSafari = function(){return isInInUserAgent("Safari")}
	var isOpera = function(){return isInInUserAgent("Opera")}
	var isIE9OrLater = function()
	{
		return !isInInUserAgent("MSIE 8")
			&& (any([9, 10], function(version){return isInInUserAgent("MSIE " + version)})
				|| isInInUserAgent("Trident"));
	}





	var getHelpTextByHotkey = function(hotkey, hotkeySingle)
	{
		var message = hotkeySingle
			? "Консоль открывается нажатием клавиши"
			: "Консоль открывается сочетанием клавиш"
		return hotkey && message + ": <b>" + hotkey + ".</b>";
	}

	var getSafariHelpText = function(hotkey)
	{
		return getHelpTextByHotkey(hotkey) +
			" Чтобы получить возможность открывать консоль, нужно включить " +
			"<a href='http://developer.apple.com/library/safari/#documentation/appleapplications/Conceptual/Safari_Developer_Guide/1Introduction/Introduction.html'>" +
			"инструменты разработки</a> в&nbsp;настройках браузера."

	}

	var getOtherHelpText = function()
	{
		return "Страница предназначена для работы только в&nbsp;<a href='https://www.google.com/intl/en/chrome/'>Хроме</a> и&nbsp;<a href='http://ru.wikipedia.org/wiki/Chromium#.D0.9F.D1.80.D0.B8.D0.BB.D0.BE.D0.B6.D0.B5.D0.BD.D0.B8.D1.8F.2C_.D0.BE.D1.81.D0.BD.D0.BE.D0.B2.D0.B0.D0.BD.D0.BD.D1.8B.D0.B5_.D0.BD.D0.B0_Chromium'>других</a> хромоподобных <a href='http://browser.yandex.ru'>браузерах</a>."
	}

	var getOtherTopText = function()
	{
		return "<div class='top-warning'>" + getOtherHelpText() + "</div>"
	}

	var getTopNotification = function(textFun, hotkey)
	{
		return "<div class='top-notification'>" + textFun(hotkey) + "</div>"
	}

	var getSafariTopText = function(hotkey)
	{
		return getTopNotification(getSafariHelpText, hotkey)
	}

	var getSupportedTopText = function(hotkey)
	{
		return getTopNotification(getHelpTextByHotkey, hotkey)
	}

	var BR_OTHER   = {
		hotkeys : [null, null],
		helpTextFun : getOtherHelpText,
		topTextFun : getOtherTopText,
		showTop : true
	};
	var BR_CHROME  = {
		hotkeys : ["Ctrl + Shift + J", "⌥⌘J"],
		helpTextFun : getHelpTextByHotkey,
		topTextFun : getSupportedTopText,
		showTop : false
	};
	var BR_FIREFOX = {
		hotkeys : ["Ctrl + Shift + K", "⌥⌘K"],
		helpTextFun : getHelpTextByHotkey,
		topTextFun : getSupportedTopText,
		showTop : false
	};
	var BR_SAFARI  = {
		hotkeys : ["Ctrl + Shift + C", "⌥⌘C"],
		helpTextFun : getSafariHelpText,
		topTextFun : getSafariTopText,
		showTop : true
	};
	var BR_OPERA   = {
		hotkeys : ["Ctrl + Shift + I", "⌥⌘I"],
		helpTextFun : getHelpTextByHotkey,
		topTextFun : getSupportedTopText,
		showTop : false
	};
	var BR_IE   = {
		hotkeys : ["F12", "F12"],
		hotkeySingle : true,
		helpTextFun : getHelpTextByHotkey,
		topTextFun : getSupportedTopText,
		showTop : false
	}

	var OS_OTHER = 0;
	var OS_MAC   = 1;

	var browser = isChrome()
		? BR_CHROME
		: isFirefox()
			? BR_FIREFOX
			: isSafari()
				? BR_SAFARI 
				: isOpera()
					? BR_OPERA
					: isIE9OrLater() ? BR_IE : BR_OTHER
	var os = isMac() ? OS_MAC : OS_OTHER

	var hotkey = browser.hotkeys[os]
	var hotkeySingle = browser.hotkeySingle

	Tortuga.Agent = {
		hotkey   : hotkey,
		topText  : browser.topTextFun(hotkey),
		helpText : browser.helpTextFun(hotkey, hotkeySingle),
		showTop  : browser.showTop
	}
})()