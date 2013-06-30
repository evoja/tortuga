ns("Tortuga.Vm");

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

	var nil = function()
	{
		return constructCommand([TR.commands.nil])
	}

	var pair = function(first, second)
	{
		return constructCommand([TR.commands.pair, first, second])
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
		var zeroParam = jcNode.params[0]
		jcNode.params[0] = this.command
		var nextCommand = constructCommand(jcNode.params)
		jcNode.params[0] = zeroParam
		jsConverter.currentCommand = pair(jsConverter.currentCommand, nextCommand)
	}

	var NODE_BEGIN  = {
		process: function(jsConverter, jcNode)
		{
			jsConverter.commandsStack.push(jsConverter.currentCommand)
			jsConverter.nodesStack.push(jcNode)
			jsConverter.currentCommand = nil()
		}
	}

	var NODE_REPEAT = {
		process: function(jsConverter, jcNode)
		{
			jsConverter.commandsStack.push(jsConverter.currentCommand)
			jsConverter.nodesStack.push(jcNode)
			jsConverter.currentCommand = nil()
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
					currentCommand = repeat(prevJcNode.params[1], currentCommand)
					break;
				}
				case NODE_BEGIN:
				default:
			}

			var prevCommand = jsConverter.commandsStack.pop()
			
			jsConverter.currentCommand = pair(prevCommand, currentCommand)
		}
	}

	var NODE_CREATE     = new SimpleNode(TR.commands.create)
	var NODE_GO         = new SimpleNode(TR.commands.go)
	var NODE_ROTATE     = new SimpleNode(TR.commands.rotate)
	var NODE_TAIL_UP    = new SimpleNode(TR.commands.tailUp)
	var NODE_TAIL_DOWN  = new SimpleNode(TR.commands.tailDown)
	var NODE_SET_WIDTH  = new SimpleNode(TR.commands.setWidth)
	var NODE_SET_COLOR  = new SimpleNode(TR.commands.setColor)
	var NODE_CLEAR_CANVAS = new SimpleNode(TR.commands.clearCanvas)
	var NODE_GET_COLOR_UNDER_TAIL = new SimpleNode(TR.commands.getColorUnderTail)

	//==== JsConverter =======================================================

	var JsConverter = function(tortoiseRunner)
	{
		this.tortoiseRunner = tortoiseRunner
		this.nodesStack = []
		this.commandsStack = []
		this.currentCommand = nil()
	}
	JsConverter.prototype.parseNode = function(node, _otherParams)
	{
		var jcNode = new JcNode(node, arguments)
		jcNode.process(this, jcNode)
		if(this.nodesStack.length == 0)
		{
			var result = this.tortoiseRunner.run(this.currentCommand)
			this.currentCommand = nil()
			return result
		}
		console.log("After: ", this)
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