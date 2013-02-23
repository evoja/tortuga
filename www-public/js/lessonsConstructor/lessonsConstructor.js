var initLessonConstructor;

(function(){
var getLinkAreaText = function(areaValue)
{
	var value = btoa(RawDeflate.deflate(Om.htmlspecialchars(areaValue, true)));
	var path = location.pathname.substring(0, location.pathname.lastIndexOf("/")+1);
	return value.length > 2000 
		? areaValue.length 
		: location.origin + location.host + path + 
				"?" + value;
}

var updateLinkArea = function(linkarea, areaValue)
{
	var url = getLinkAreaText(areaValue);

	var textinput = document.createElement("INPUT");
	textinput.type = "text";
	textinput.disabled = true;
	textinput.style.width = "100%";
	textinput.value = url;//'<a href="' + url + '">' + url + '</a>';

	var link = document.createElement("A");
	link.href = url;
	link.appendChild(textinput);
	linkarea.innerHTML = "";
	linkarea.appendChild(link);

	textinput.select();
}

initLessonConstructor = function(area, button, linkarea)
{
	button.onclick = function(e){updateLinkArea(linkarea, area.value)}

}
})()