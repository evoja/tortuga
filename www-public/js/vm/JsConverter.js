/**
В абстрактном плане, это больше похоже на синтаксический анализатор.
JsConverter принимает объекты-лексемы,
а на выходе получается дерево программы, которое потом скармливается
в исполнитель - TortoiseRunner.

В нашей программе команды для JsConverter формируются и вызываются 
в Tortoise.

*/
ns("Tortuga.Vm");

Tortuga.Vm.JsConverter;

/** 
Пример использования:

//Создаём черепаху
var t = MyJc.parseNode(MyJc.nodes.create, 0, 0, "green", 1)
//Прём вперёд
MyJc.parseNode(MyJc.nodes.go, t, 100)

//Начинаем цепочку
MyJc.parseNode(MyJc.nodes.begin)
//Делаем три вызова, ничего не происходит
MyJc.parseNode(MyJc.nodes.go, t, 100)
MyJc.parseNode(MyJc.nodes.go, t, 100)
MyJc.parseNode(MyJc.nodes.go, t, 100)
//Обрываем цепочку, выполняются все три команды
MyJc.parseNode(MyJc.nodes.end)

//Повторения:
var fun = function(n)
{
	var m1 = new Date().getTime()
	var t = MyJc.parseNode(MyJc.nodes.create, 0, 0, "green", 1)
	MyJc.parseNode(MyJc.nodes.tailDown, t)
	
	MyJc.parseNode(MyJc.nodes.repeat, n)
		MyJc.parseNode(MyJc.nodes.go, t, 3)
		MyJc.parseNode(MyJc.nodes.rotate, t, 90)
		MyJc.parseNode(MyJc.nodes.go, t, 3)
		MyJc.parseNode(MyJc.nodes.rotate, t, -90)
	MyJc.parseNode(MyJc.nodes.end)
	var m2 = new Date().getTime()
	return m2 - m1
}

*/


(function()
{
	var TR = Tortuga.Vm.TortoiseRunner

	var constructCommand = function(params)
	{
		return TR.constructCommand.apply(TR, params)
	}

	var seq = function()
	{
		return constructCommand([TR.commands.seq, []])
	}

	var appendCommandToSeq = function(seq, command)
	{
		TR.appendCommandToSeq(seq, command)
	}

	var concatSeqs = function(seq1, seq2)
	{
		return TR.concatSeqs(seq1, seq2)
	}

	var repeat = function(count, command)
	{
		return constructCommand([TR.commands.repeat, count, command])
	}

	var JcNode = function(node, args)
	{
		this.node = node
		args[0] = null
		this.params = args
	}
	JcNode.prototype.process = function(_args)
	{
		this.node.process.apply(this.node, arguments)
	}

	var SimpleNode = function(command)
	{
		this.command = command
	}
	SimpleNode.prototype.process = function(jsConverter, jcNode)
	{
		var params = jcNode.params
		var zeroParam = params[0]
		params[0] = this.command
		var nextCommand = constructCommand(params)
		params[0] = zeroParam
		appendCommandToSeq(jsConverter.currentCommand, nextCommand)
	}

	var SimpleVariableNode = function(command)
	{
		this.command = command
	}
	SimpleVariableNode.prototype.process = function(jsConverter, jcNode)
	{
		var params = jcNode.params
		var zeroParam = params[0]
		var firstParam = params[1]
		params[0] = this.command
		params[1] = function(){return firstParam.value}
		var nextCommand = constructCommand(params)
		params[0] = zeroParam
		params[1] = firstParam
		appendCommandToSeq(jsConverter.currentCommand, nextCommand)
	}

	var ResultNode = function(command)
	{
		this.command = command
	}
	ResultNode.prototype.process = function(jsConverter, jcNode)
	{
		var jsVar = new JsVariable()
		var args = [this.command]
		var params = jcNode.params
		var paramsLen = params.length
		for(var i = 1; i < paramsLen; ++i)
		{
			args.push(params[i])
		}
		args.push(function(result){jsVar.value = result})

		var nextCommand = constructCommand(args)

		appendCommandToSeq(jsConverter.currentCommand, nextCommand)
		jsConverter.result = jsVar
	}
	var NODE_BEGIN  = {
		process: function(jsConverter, jcNode)
		{
			jsConverter.commandsStack.push(jsConverter.currentCommand)
			jsConverter.nodesStack.push(jcNode)
			jsConverter.currentCommand = seq()
		}
	}
	var NODE_REPEAT = {
		process: function(jsConverter, jcNode)
		{
			    jsConverter.commandsStack.push(jsConverter.currentCommand)
			    jsConverter.nodesStack.push(jcNode)
			    jsConverter.currentCommand = seq()
		}		
	}

	var NODE_END = {
		process: function(jsConverter, jcNode)
		{
			var prevJcNode = jsConverter.nodesStack.pop()
			var currentCommand = jsConverter.currentCommand
			switch(prevJcNode.node)
			{
				case NODE_REPEAT:
				{
					var repeatCommand = repeat(prevJcNode.params[1], currentCommand)
					currentCommand = seq()
					appendCommandToSeq(currentCommand, repeatCommand)
					break;
				}
				case NODE_BEGIN:
				default:
			}

			var prevCommand = jsConverter.commandsStack.pop()
			
			jsConverter.currentCommand = concatSeqs(prevCommand, currentCommand)
		}
	}

	var NODE_CREATE     = new ResultNode(TR.commands.create)
	var NODE_GET_COLOR_UNDER_TAIL = new ResultNode(TR.commands.getColorUnderTail)

	var NODE_GO         = new SimpleVariableNode(TR.commands.go)
	var NODE_ROTATE     = new SimpleVariableNode(TR.commands.rotate)
	var NODE_TAIL_UP    = new SimpleVariableNode(TR.commands.tailUp)
	var NODE_TAIL_DOWN  = new SimpleVariableNode(TR.commands.tailDown)
	var NODE_SET_WIDTH  = new SimpleVariableNode(TR.commands.setWidth)
	var NODE_SET_COLOR  = new SimpleVariableNode(TR.commands.setColor)
	var NODE_CLEAR_CANVAS = new SimpleNode(TR.commands.clearCanvas)

	//==== JsConverter =======================================================
	var JsVariable = function(value)
	{
		this.value = value
	}

	var JsConverter = function(tortoiseRunner)
	{
		this.tortoiseRunner = tortoiseRunner
		this.nodesStack = []
		this.commandsStack = []
		this.currentCommand = seq()
	}
	JsConverter.prototype.parseNode = function(node, _otherParams)
	{
		this.result = null
		var jcNode = new JcNode(node, arguments)
		jcNode.process(this, jcNode)
		if(this.nodesStack.length == 0)
		{
			this.tortoiseRunner.run(this.currentCommand)
			this.currentCommand = seq()
		}

		return this.result
	}
	JsConverter.prototype.nodes = {
		begin    : NODE_BEGIN,
		repeat   : NODE_REPEAT,
		end      : NODE_END,
		create   : NODE_CREATE,
		go       : NODE_GO,
		rotate   : NODE_ROTATE,
		tailUp   : NODE_TAIL_UP,
		tailDown : NODE_TAIL_DOWN,
		setWidth : NODE_SET_WIDTH,
		setColor : NODE_SET_COLOR,
		clearCanvas : NODE_CLEAR_CANVAS,
		getColorUnderTail : NODE_GET_COLOR_UNDER_TAIL
	}
	Tortuga.Vm.JsConverter = JsConverter
})()