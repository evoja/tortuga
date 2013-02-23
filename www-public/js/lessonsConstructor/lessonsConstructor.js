var initLessonConstructor;

(function(){
var getLinkAreaText = function(areaValue)
{
	var link = ParamsUtil.getLessonLink(areaValue);
	return link.length > 2000 ? areaValue.length : link;
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