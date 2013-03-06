ns("Tortuga");
(function()
{
	var BR_OTHER = 0;
	var BR_CHROME = 1;
	var BR_FIREFOX = 2;

	var OS_OTHER = 0;
	var OS_MAC = 1;

	var browser = Om.isChrome()
		? BR_CHROME
		: (Om.isFirefox() ? BR_FIREFOX : BR_OTHER)

	var os = Om.isMac() ? OS_MAC : OS_OTHER

	var hotkey;

	switch(browser)
	{
		case BR_CHROME:
			hotkey = os == OS_MAC ? "⌥⌘J" : "Ctrl + Shift + J"
			break;
		case BR_FIREFOX:
			hotkey = os == OS_MAC ? "⌥⌘K" : "Ctrl + Shift + K"
			break;
		default:
			hotkey = null;
	}

	var topText = hotkey == null
		? "<div class='warning'>Страница предназначена для работы только в&nbsp;<a href='https://www.google.com/intl/en/chrome/'>Хроме</a> и&nbsp;<a href='http://ru.wikipedia.org/wiki/Chromium#.D0.9F.D1.80.D0.B8.D0.BB.D0.BE.D0.B6.D0.B5.D0.BD.D0.B8.D1.8F.2C_.D0.BE.D1.81.D0.BD.D0.BE.D0.B2.D0.B0.D0.BD.D0.BD.D1.8B.D0.B5_.D0.BD.D0.B0_Chromium'>других</a> хромоподобных <a href='http://browser.yandex.ru'>браузерах</a>.</div>"
		: null

	var helpText = hotkey == null
		? topText
		: "Консоль открывается сочетанием клавиш: <b>" + hotkey + "</b>"

	Tortuga.Agent = {
		hotkey : hotkey,
		topText : topText,
		helpText : helpText
	}
})()