/*
За возможность создания этого файла спасибо статье:
http://www.html5rocks.com/en/tutorials/file/dndfiles/

Файл отвечает за возможность выполнить скрипт,
который пользователь выбирает на своём компьютере.
*/
om.ns("Tortuga");
Tortuga.initFiles = function(filesSelector, canvasObject, preAction,postAction)
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
		console.log(script)
		preAction();
		var scriptElement = document.createElement("script")
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

	var handleFileSelection = function(evt)
	{
		mapFileList(evt.target.files, processFile);
		evt.target.value = "";
	}

	var preventDefault = function(e)
	{
		e.preventDefault ? e.preventDefault() : (e.returnValue = false);
	}

	var handleDragOver = function(e)
	{
		preventDefault(e)
		canvasObject.classList.add("tortuga-canvasContainer-dragging")
	}
	var handleDragLeave = function()
	{
		canvasObject.classList.remove("tortuga-canvasContainer-dragging")
	}

	var doDrop = function(e)
	{
		canvasObject.classList.remove("tortuga-canvasContainer-dragging")
		if (e.dataTransfer.files)
		{
			var file = e.dataTransfer.files;
			for (var i=0; i<file.length; i++)
			{
				processFile(file[i]);
			}
			preventDefault(e)
		}

		if (e.dataTransfer.getData("Text"))
		{
			var text = e.dataTransfer.getData("Text");
			processScript(text);
			preventDefault(e)
		}
		return false;
	}
	
	filesSelector.addEventListener("change", handleFileSelection, false);
	canvasObject.addEventListener("dragleave", handleDragLeave, false);
	canvasObject.addEventListener("dragover", handleDragOver, false);
	canvasObject.addEventListener("drop", doDrop, false);
}