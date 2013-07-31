/**
Код, обеспечивающий работу страницы constructor.html

Работает по тем же принципам, что и index.html+tortuga.js
В него передаются элементы вебстраницы, которые должны быть задействованы
в обеспечении функциональности, а в этом файле они связываются программной логикой.
*/
ns("Torguta");

Tortuga.initLessonConstructor;

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

var updateArea = function (inputValue, area)
{
	var jsonOfText =  Tortuga.ParamsUtil.getLessonTextFromGetUriValue(inputValue);
	var resultText="";
	objLesson = JSON.parse(jsonOfText);

	resultText = objLesson.title;

	var size = objLesson.items.length;
	var items = objLesson.items;
	
	for(var i = 0; i < size; i += 1)
	{
		for (key in items[i]){
			resultText = resultText + '\n\n' + items[i][key];
		}
	}

	area.value = resultText;
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

Tortuga.initLessonConstructor = function(area, createbutton, linkarea, changebutton, input)
{
	createbutton.onclick = function(e){updateLinkArea(linkarea, area.value)}
	changebutton.onclick = function(e){updateArea(input.value, area)}
}
})()