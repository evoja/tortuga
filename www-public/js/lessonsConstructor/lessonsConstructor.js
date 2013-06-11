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


var parseShortenedResponse = function(m, longUrl) {
			console.log(m, m.content);
            var url = null;
            try {                
                url = JSON.parse(m.content).id;
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
        function(m){parseShortenedResponse(m, url)});
    }



var updateLinkArea = function(linkarea, areaValue)
{
	var longUrl = getLinkAreaText(createLesson(areaValue));
	var xz = Tortuga.ParamsUtil.getLessonTextFromUriValue();
	console.log('xz', xz);
	
	if(longUrl.length < 2000)
	{
		var res = getShortenURL(longUrl);
	/*	var textinput = document.createElement("INPUT");
		textinput.type = "text";
		textinput.disabled = true;
		textinput.value = url;

		var link = document.createElement("A");
		link.href = url;
		link.innerHTML = "Try lesson";

		linkarea.appendChild(textinput);
		linkarea.appendChild(link);
		textinput.select();*/
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
})()