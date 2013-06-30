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


*/


(function()
{
	var TR = Tortuga.Vm.TortoiseRunner
	var TR_CREATE = TR.commands.create
	var TR_GO = TR.commands.go
	var TR_PAIR = TR.commands.pair
	var TR_NIL = TR.commands.nil

	var constructCommand = function(params)
	{
		return TR.constructCommand.apply(TR, params)
	}

	var nil = function()
	{
		return constructCommand([TR_NIL])
	}

	var pair = function(first, second)
	{
		return constructCommand([TR_PAIR, first, second])
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

	var NODE_BEGIN  = {
		name:"begin",
		process: function(jsConverter, jcNode)
		{
			jsConverter.commandsStack.push(jsConverter.currentCommand)
			jsConverter.nodesStack.push(jcNode)
			jsConverter.currentCommand = nil()
		}
	}
	var NODE_END = {
		name:"end",
		process: function(jsConverter, jcNode)
		{
			var node = jsConverter.nodesStack.pop()

			var prevCommand = jsConverter.commandsStack.pop()
			
			jsConverter.currentCommand = pair(prevCommand, jsConverter.currentCommand)
		}
	}

	var NODE_CREATE = {
		name:"create",
		process: function(jsConverter, jcNode)
		{
			var zeroParam = jcNode.params[0]
			jcNode.params[0] = TR_CREATE
			var nextCommand = constructCommand(jcNode.params)
			jcNode.params[0] = zeroParam
			jsConverter.currentCommand = pair(jsConverter.currentCommand, nextCommand)
		}
	}

	var NODE_GO = {
		name:"go",
		process: function(jsConverter, jcNode)
		{
			var zeroParam = jcNode.params[0]
			jcNode.params[0] = TR_GO
			var nextCommand = constructCommand(jcNode.params)
			jcNode.params[0] = zeroParam
			jsConverter.currentCommand = pair(jsConverter.currentCommand, nextCommand)
		}
	}

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
		begin : NODE_BEGIN,
		end   : NODE_END,
		create: NODE_CREATE,
		go    : NODE_GO
	}

	Tortuga.Vm.JsConverter = JsConverter
})()