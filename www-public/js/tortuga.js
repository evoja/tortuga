ns("Tortuga");
var SQ2 = Math.sqrt(2);

(function(){
var getAppendedClassName = Om.getAppendedClassName

var appendClass = function (elem, className)
{
	elem.className = getAppendedClassName(elem.className, className)
}

var TortugaEnv = function(){}
TortugaEnv.prototype.setLessonsTitle = function(lessonsTitle)
{
	document.title = lessonsTitle + " \\ Tortuga";
}


//==== canvas =======
var createCanvasBg = function(canvasContainer)
{
	var bg = document.createElement("DIV")
	appendClass(bg, "tortuga-canvasContainer-bg")
	canvasContainer.appendChild(bg)
	return bg;
}

var createCanvas = function(canvasContainer)
{
	var canvas = document.createElement("CANVAS")
	appendClass(canvas, "tortuga-canvasContainer-canvas")
	var width = Math.min(canvasContainer.offsetWidth, 1100);
	var height = Math.floor(width * 4 / 8);
	canvas.width = width
	canvas.height = height
	console.log(width, height);
	canvasContainer.style.width = width + "px";
	canvasContainer.style.height = height + "px";
	console.log(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
	canvasContainer.appendChild(canvas)
	return canvas
}

var configureCanvasContainer = function(canvasContainer)
{
	appendClass(canvasContainer, "tortuga-canvasContainer")

	var bg = createCanvasBg(canvasContainer)
	var canvas = createCanvas(canvasContainer)

	return {
		canvasContainer: canvasContainer,
		canvas: canvas,
		bg: bg
	}
}

//==== files =======
var configureFilesArea = function(filesArea)
{
	appendClass(filesArea, "tortuga-filesArea")

	var button = document.createElement("INPUT")
	appendClass(button, "tortuga-filesArea-button")
	button.type = "file"
	button.multiple = true
	filesArea.appendChild(button)
	return {
		filesArea : filesArea,
		button: button
	}
}

//==== lessons ======
var configureLessonsAreas = function(lessonsListContainer, lessonItemDescription)
{
	appendClass(lessonsList, "tortuga-lessonsListContainer")
	appendClass(lessonItemDescription, "tortuga-lessonItemDescription")
	return {
		lessonsListContainer : lessonsListContainer,
		lessonItemDescription : lessonItemDescription
	}
}

//===== App ============
var initApp = function(
	canvasContainer,
	lessonsListContainer,
	lessonItemDescription,
	lessonsContainers,
	filesArea
	)
{
	var canvasObjects = configureCanvasContainer(canvasContainer)
	var filesObjects = configureFilesArea(filesArea)
	var lessonsObjects = configureLessonsAreas(lessonsListContainer, lessonItemDescription);

	Tortuga.initDrawing(canvasObjects.canvas)
	Tortuga.initTortoise(canvasObjects.canvasContainer)
	Tortuga.initFiles(filesObjects.button)
	Tortuga.initLessons(canvasObjects.bg, lessonsListContainer, lessonItemDescription,
		new TortugaEnv(), lessonsContainers);
/*
		initTortoiseCanvasBackground(document.getElementById("canvasContainer-bg"));
*/
}


Tortuga.initApp = initApp;
})()