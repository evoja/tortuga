/**
В этом файле определяется функция Tortuga.initApp()

При её вызове связываются существующие html-элементы
создаются нужные данные,
вспомогательные html-элементы, 
на элементы навешиваются разные обработчики событий, 
ну и вообще, всё опутывается некоторой логикой, распределённой по разным файлам.

Вообще на данный момент, здесь два основных компонента:

* поле с черепашкой
* список и текст уроков.

Стилизуются эти элементы в CSS, а JS отвечает за заполнение содержимым
и навешивание правильных классов.
*/
ns("Tortuga");
var SQ2 = Math.sqrt(2);
Tortuga.initApp;

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
	canvasContainer, //контейнер поля с черепашкой, в котором создаётся canvas, 
	                 //задний фон, а также будут складываться объекты,
	                 //соответствующие каждой черепашке.
	lessonsListContainer, //контейнер для списка задач урока, куда поместятся заголовки задач
	                      //и будут переключаться стили выделенной/невыделенной задачи.
	lessonItemDescription, //контейнер для текста урока, куда будет помещаться текст выделенной задачи
	lessonsContainers, //все элементы, которые нужно будет стирать.
	filesArea, //блок, куда будет добавлен элемент выбора файла.
	dropFilesArea //блок, куда пользователь сможет перетаскивать файлы при помощи драг-н-дропа.
	)
{
	var canvasObjects = configureCanvasContainer(canvasContainer)
	var filesObjects = configureFilesArea(filesArea)
	var lessonsObjects = configureLessonsAreas(lessonsListContainer, lessonItemDescription);

	var jsConverter = Tortuga.Vm.initVm(canvasObjects.canvas, canvasObjects.canvasContainer)
	Tortuga.Vm.initTortoise(canvasObjects.canvasContainer, jsConverter)
	Tortuga.initFiles(filesObjects.button, dropFilesArea, begin,end)
	Tortuga.initLessons(canvasObjects.bg, lessonsListContainer, lessonItemDescription,
		new TortugaEnv(), lessonsContainers);
}


Tortuga.initApp = initApp;
})()