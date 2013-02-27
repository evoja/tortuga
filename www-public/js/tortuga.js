ns("Tortuga");
var SQ2 = Math.sqrt(2);

(function(){
var getAppendedClassName = Om.getAppendedClassName

var appendClass = function (elem, className)
{
	elem.className = getAppendedClassName(elem.className, className)
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
	canvas.width = canvasContainer.offsetWidth
	canvas.height = canvasContainer.offsetHeight
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
	filesArea
	)
{
	var canvasObjects = configureCanvasContainer(canvasContainer)
	var filesObjects = configureFilesArea(filesArea)
	var lessonsObjects = configureLessonsAreas(lessonsListContainer, lessonItemDescription);

	Tortuga.initDrawing(canvasObjects.canvas)
	Tortuga.initTortoise(canvasObjects.canvasContainer)
	Tortuga.initFiles(filesObjects.button)
	Tortuga.initLessons(canvasObjects.bg, lessonsListContainer, lessonItemDescription);
/*
		initTortoiseCanvasBackground(document.getElementById("canvasContainer-bg"));
*/
}


Tortuga.initApp = initApp;
})()