ns("Tortuga");
(function()
{
	var getHelpTextByHotkey = function(hotkey)
	{
		return hotkey && "Консоль открывается сочетанием клавиш: <b>" + hotkey + ".</b>";
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

	var BR_OTHER   = 0;
	var BR_CHROME  = 1;
	var BR_FIREFOX = 2;
	var BR_SAFARI  = 3;
	var BR_OPERA   = 4;

	var OS_OTHER = 0;
	var OS_MAC   = 1;

	var HOTKEYS = [
		[null, null],
		["Ctrl + Shift + J", "⌥⌘J"],
		["Ctrl + Shift + K", "⌥⌘K"],
		[null, "⌥⌘C"],
		[null, "⌥⌘I"]
	]

	var SUPPORTED_BROWSERS = [false, true, true, false, true]

	var HELP_TEXTS_FUNS = [
		getOtherHelpText,
		getHelpTextByHotkey,
		getHelpTextByHotkey,
		getSafariHelpText,
		getHelpTextByHotkey,
	]

	var TOP_TEXTS_FUNS = [
		getOtherTopText,
		getSupportedTopText,
		getSupportedTopText,
		getSafariTopText,
		getSupportedTopText,
	]

	var browser = Om.isChrome()
		? BR_CHROME
		: Om.isFirefox()
			? BR_FIREFOX
			: Om.isSafari()
				? BR_SAFARI 
				: Om.isOpera() ? BR_OPERA : BR_OTHER

	var os = Om.isMac() ? OS_MAC : OS_OTHER

	var hotkey = HOTKEYS[browser][os]

	Tortuga.Agent = {
		hotkey   : hotkey,
		topText  : TOP_TEXTS_FUNS[browser](hotkey),
		helpText : HELP_TEXTS_FUNS[browser](hotkey),
		showTop  : !SUPPORTED_BROWSERS[browser]
	}
})()