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
om.ns_run("Tortuga", function(ns)
{

var appendClass = function (elem, className)
{
    elem.classList.add(className);
};

var TortugaEnv = function(){}
TortugaEnv.prototype.setLessonsTitle = function(lessonsTitle)
{
    document.title = lessonsTitle + " \\ Tortuga";
};


//==== files =======
var configureFilesArea = function(filesArea)
{
    appendClass(filesArea, "tortuga-filesArea");

    var button = document.createElement("INPUT");
    appendClass(button, "tortuga-filesArea-button");
    button.type = "file";
    button.multiple = true;
    filesArea.appendChild(button);
    return {
        filesArea : filesArea,
        button: button
    };
};

//==== lessons ======
var configureLessonsAreas = function(lessonsListContainer, lessonItemDescription)
{
    appendClass(lessonsList, "tortuga-lessonsListContainer");
    appendClass(lessonItemDescription, "tortuga-lessonItemDescription");
    return {
        lessonsListContainer : lessonsListContainer,
        lessonItemDescription : lessonItemDescription
    };
};

//===== App ============
ns.initApp = function(
    lessonsListContainer, //контейнер для списка задач урока, куда поместятся заголовки задач
                          //и будут переключаться стили выделенной/невыделенной задачи.
    lessonItemDescription, //контейнер для текста урока, куда будет помещаться текст выделенной задачи
    lessonsContainers, //все элементы, которые нужно будет стирать.
    filesArea, //блок, куда будет добавлен элемент выбора файла.
    dropFilesArea //блок, куда пользователь сможет перетаскивать файлы при помощи драг-н-дропа.
    )
{
    var filesObjects = configureFilesArea(filesArea);
    var lessonsObjects = configureLessonsAreas(lessonsListContainer, lessonItemDescription);

    var bg_service = angular.element(document.getElementById('t_box_module'))
                        .injector().get('tbox_tortoise_canvas_bg_dispatcher');
    var do_nothing = function(){};
    Tortuga.initFiles(filesObjects.button, dropFilesArea, do_nothing, do_nothing);
    trtg.lessons.initLessons(bg_service, lessonsListContainer, lessonItemDescription,
        new TortugaEnv(), lessonsContainers);
}

});