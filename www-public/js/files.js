/*
За возможность создания этого файла спасибо статье:
http://www.html5rocks.com/en/tutorials/file/dndfiles/

Файл отвечает за возможность выполнить скрипт,
который пользователь выбирает на своём компьютере.
*/
ns("Tortuga");
Tortuga.initFiles = function(filesSelector, canvasObjekt, preAction,postAction)
{
	var mapFileList = function(list, fun)
	{
		var size = list.length;
		for(var i = 0; i < size; ++i)
		{
			fun(list[i]);
		}
	}

	var processScript =  function(script)
	{
		preAction();
		var scriptElement = document.createElement("script");
	    scriptElement.innerHTML = script;

		var headElement = document.getElementsByTagName("head")[0];
		headElement.appendChild(scriptElement);
		postAction();
	}
	var processFile = function(file)
	{
		var reader = new FileReader();
		reader.onload = function(e)
		{
			processScript(e.target.result)
		};

		reader.readAsText(file);
	}

	var processText = function(script)
	{
		processScript(script)
	}

	var handleFileSelection = function(evt)
	{
		mapFileList(evt.target.files, processFile);
		evt.target.value = "";
	}

	var preventDefault = function(e)
	{
		e.preventDefault ? e.preventDefault() : (e.returnValue = false);
	}

    var dodrop = function(e) {
    	if (e.dataTransfer.files)
    	{
	        var file = e.dataTransfer.files;
	        for (var i=0; i<file.length; i++)
	        {
	            processFile(file[i]);
	        }
	        preventDefault(e)
	    }

	    if (e.dataTransfer.getData('Text'))
	    {
	        var text = e.dataTransfer.getData('Text');
	        processText(text);
	        preventDefault(e)
	    }
	    return false;
    }
	
	filesSelector.addEventListener('change', handleFileSelection, false);
	canvasObjekt.addEventListener("dragover", preventDefault, false);
    canvasObjekt.addEventListener("drop", dodrop, false);
}