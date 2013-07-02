ns("Torguta");
(function(){
var getLinkAreaText = function(areaValue)
{
	var link = Tortuga.ParamsUtil.getLessonLink(areaValue);
	return link;
}

var createLesson = function(text)
{
	var lines = text.split("\n\n");
	var size = lines.length;

	var title = lines[0];
	var items = [];
	for(var i = 1; i < size; i += 3)
	{
		items.push({
				title: lines[i + 0],
				src: lines[i + 1],
				description: lines[i + 2]
			});
	}
	return {title: title, items: items};
}


var parseShortenedResponse = function(receivedData, longUrl) {
    var url = null;
    try {                
        url = JSON.parse(receivedData.content).id;
        if (typeof url != 'string') url = longUrl;
    } catch (e) {
        url = longUrl;
    }

    linkarea.innerHTML = "";			
	var textinput = document.createElement("INPUT");
	textinput.type = "text";
	textinput.disabled = true;
	textinput.value = url;

	var link = document.createElement("A");
	link.href = url;
	link.innerHTML = "Try lesson";

	linkarea.appendChild(textinput);
	linkarea.appendChild(link);
	textinput.select();        
}

var getShortenURL = function(url) {
    jsonlib.fetch(
        {
            url: 'https://www.googleapis.com/urlshortener/v1/url',
            header: 'Content-Type: application/json',
            method: 'POST',
            data: JSON.stringify({longUrl: url})
        }, 
        function(receivedData){parseShortenedResponse(receivedData, url)});
    }

var updateArea = function (areaValue, inputValue)
{
	var t =  Tortuga.ParamsUtil.getLessonTextFromGetUriValue(inputValue);
	var paramBegin = null;
	var paramAnd = null;
	var paramText = null;
	var resultText = "";

	paramBegin = t.indexOf(':"');
	paramAnd = t.indexOf('"', paramBegin + 2);

	
	while (paramBegin > 0)
	{
		paramText = t.substr(paramBegin + 2, paramAnd - paramBegin - 2);
		resultText = resultText + paramText + '\n\n';
		t = t.substr(paramAnd + 2);
		paramBegin = t.indexOf(':"');
		paramAnd = t.indexOf('"', paramBegin + 2);
	}

	document.getElementById('area').value = resultText;
}

var updateLinkArea = function(linkarea, areaValue)
{
	var longUrl = getLinkAreaText(createLesson(areaValue));
		
	if(longUrl.length < 2000)
	{
		var res = getShortenURL(longUrl);
	}
	else
	{
		linkarea.innerHTML = "Слишком длинный урок (" + areaValue.length + ")";
	}
}

Tortuga.initLessonConstructor = function(area, button, linkarea)
{
	button.onclick = function(e){updateLinkArea(linkarea, area.value)}

}

Tortuga.givLessonArea = function(area, button, input)
{
	button.onclick = function(e){updateArea(area.value, input.value)}

}
})()