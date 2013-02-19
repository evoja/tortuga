(function()
{
	var st;
	var isDrawing;

	selectTortoise = function(t)
	{
		st = t
		st.tailUp();
		isDrawing = false;
	}

	document.onkeydown = function(e)
	{
		e = e || window.event;
		var code = event.keyCode;
	    if (event.charCode && code == 0)
	          code = event.charCode;
	     switch(code) {
	          case 37:
	              // Key left.
	              st.rotate(15);
	              break;
	          case 38:
	              // Key up.
	              st.go(2);
	              break;
	          case 39:
	              // Key right.
	              st.rotate(-15);
	              break;
	          case 40:
	              // Key down.
	              if(isDrawing)
	              {
	              	st.tailUp();
	              }
	              else
	              {
	              	st.tailDown();
	              }
	              isDrawing = !isDrawing;
	              break;
	          default:
	          	return;
	     }
	     event.preventDefault();
	}
})()

