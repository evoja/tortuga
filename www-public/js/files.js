/*
За возможность создания этого файла спасибо статье:
http://www.html5rocks.com/en/tutorials/file/dndfiles/

Файл отвечает за возможность выполнить скрипт,
который пользователь выбирает на своём компьютере.
*/
ns("Tortuga");
Tortuga.initFiles = function(filesSelector)
{
	var mapFileList = function(list, fun)
	{
		var size = list.length;
		for(var i = 0; i < size; ++i)
		{
			fun(list[i]);
		}
	}

	var processFile = function(file)
	{
		var reader = new FileReader();
		// Closure to capture the file information.
		reader.onload = function(e)
		{
			console.log(e.target.result);
			var scriptElement = document.createElement("script");
			scriptElement.innerHTML = e.target.result;

			var headElement = document.getElementsByTagName("head")[0];
			headElement.appendChild(scriptElement);
		};

		reader.readAsText(file);
	}

	var handleFileSelection = function(evt)
	{
		mapFileList(evt.target.files, processFile);
		evt.target.value = "";
	}

	filesSelector.addEventListener('change', handleFileSelection, false);
}