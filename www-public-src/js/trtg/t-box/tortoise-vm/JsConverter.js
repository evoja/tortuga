om.ns_run("trtg.tbox.tortoise_vm", function(ns)
{
/**
@constructor
@name trtg.tbox.tortoise_vm.JsConverter
@description

В абстрактном плане, это больше похоже на синтаксический анализатор.
JsConverter принимает объекты-лексемы,
а на выходе получается дерево программы, которое потом скармливается
в исполнитель - TortoiseRunner.

В нашей программе команды для JsConverter формируются и вызываются 
в Tortoise.

@example <caption>Пример использования:</caption>

var myJc = angular.element(document.getElementById('t_box_module')).injector().get('tbox_tortoisevm_js-converter');
//Создаём черепаху
var t = myJc.parseNode(myJc.nodes.create, 0, 0, "green", 1, "round")
//Прём вперёд
myJc.parseNode(myJc.nodes.go, t, 100)

//Начинаем цепочку
myJc.parseNode(myJc.nodes.begin)
//Делаем три вызова, ничего не происходит
myJc.parseNode(myJc.nodes.go, t, 100)
myJc.parseNode(myJc.nodes.go, t, 100)
myJc.parseNode(myJc.nodes.go, t, 100)
//Обрываем цепочку, выполняются все три команды
myJc.parseNode(myJc.nodes.end)

//Повторения:
var fun = function(n)
{
    var m1 = new Date().getTime()
    var t = myJc.parseNode(myJc.nodes.create, 0, 0, "green", 1, "round")
    myJc.parseNode(myJc.nodes.tailDown, t)

    myJc.parseNode(myJc.nodes.repeat, n)
        myJc.parseNode(myJc.nodes.go, t, 3)
        myJc.parseNode(myJc.nodes.rotate, t, 90)
        myJc.parseNode(myJc.nodes.go, t, 3)
        myJc.parseNode(myJc.nodes.rotate, t, -90)
    myJc.parseNode(myJc.nodes.end)
    var m2 = new Date().getTime()
    return m2 - m1
}

*/


/** @todo Remove it absolute relation. Everything must be injected */
var TR = om.ns_get("trtg.tbox.tortoise_vm.TortoiseRunner");

var constructCommand = function(params)
{
    return TR.constructCommand.apply(TR, params);
};

var seq = function()
{
    return constructCommand([TR.commands.seq, []]);
};

var appendCommandToSeq = function(seq, command)
{
    TR.appendCommandToSeq(seq, command);
};

var concatSeqs = function(seq1, seq2)
{
    return TR.concatSeqs(seq1, seq2);
};

var repeat = function(count, command)
{
    return constructCommand([TR.commands.repeat, count, command]);
};

var JcNode = function(node, args)
{
    this.node = node;
    args[0] = null;
    this.params = args;
};
JcNode.prototype.process = function(_args)
{
    this.node.process.apply(this.node, arguments);
};

var SimpleNode = function(command)
{
    this.command = command;
}
SimpleNode.prototype.process = function(jsConverter, jcNode)
{
    var params = jcNode.params;
    var zeroParam = params[0];
    params[0] = this.command;
    var nextCommand = constructCommand(params);
    params[0] = zeroParam;
    appendCommandToSeq(jsConverter.currentCommand, nextCommand);
};

//Это нода, аргументом с индексом 1 которой является JsVariable,
//обычно это переменная целевой черепахи,
//но может использоваться и для других нужд.
var FirstParamIsVariableNode = function(command)
{
    this.command = command;
};
FirstParamIsVariableNode.prototype.process = function(jsConverter, jcNode)
{
    var params = jcNode.params;
    var zeroParam = params[0];
    var firstParam = params[1];
    params[0] = this.command;
    params[1] = function(){return firstParam.value;};
    var nextCommand = constructCommand(params);
    params[0] = zeroParam;
    params[1] = firstParam;
    appendCommandToSeq(jsConverter.currentCommand, nextCommand);
};

//Это нода, которая возвращает результат в виде JsVariable
var ResultNode = function(command)
{
    this.command = command;
};
ResultNode.prototype.process = function(jsConverter, jcNode)
{
    var jsVar = new JsVariable();
    var args = [this.command];
    var params = jcNode.params;
    var paramsLen = params.length;
    for(var i = 1; i < paramsLen; ++i)
    {
        args.push(params[i]);
    }
    args.push(function(result){jsVar.value = result});

    var nextCommand = constructCommand(args);

    appendCommandToSeq(jsConverter.currentCommand, nextCommand);
    jsConverter.result = jsVar;
}

//Это нода, аргументом с индексом 1 которой является JsVariable,
//обычно это переменная целевой черепахи,
//но может использоваться и для других нужд.
//И одновременно с этим
//это нода, которая возвращает результат в виде JsVariable
var FirstParamIsVariableResultNode = function(command)
{
    this.command = command;
}
FirstParamIsVariableResultNode.prototype.process = function(jsConverter, jcNode)
{
    var jsVar = new JsVariable();
    var args = [this.command];
    var params = jcNode.params;

    var firstParam = params[1];
    args.push(function(){return firstParam.value});

    var paramsLen = params.length;
    for(var i = 2; i < paramsLen; ++i)
    {
        args.push(params[i]);
    }
    args.push(function(result){jsVar.value = result;});

    var nextCommand = constructCommand(args);

    appendCommandToSeq(jsConverter.currentCommand, nextCommand);
    jsConverter.result = jsVar;
};


var NODE_BEGIN  = {
    process: function(jsConverter, jcNode)
    {
        jsConverter.commandsStack.push(jsConverter.currentCommand);
        jsConverter.nodesStack.push(jcNode);
        jsConverter.currentCommand = seq();
    }
};
var NODE_REPEAT = {
    process: function(jsConverter, jcNode)
    {
            jsConverter.commandsStack.push(jsConverter.currentCommand);
            jsConverter.nodesStack.push(jcNode);
            jsConverter.currentCommand = seq();
    }        
};

var NODE_END = {
    process: function(jsConverter, jcNode)
    {
        var prevJcNode = jsConverter.nodesStack.pop();
        var currentCommand = jsConverter.currentCommand;
        switch(prevJcNode.node)
        {
            case NODE_REPEAT:
            {
                var repeatCommand = repeat(prevJcNode.params[1], currentCommand);
                currentCommand = seq();
                appendCommandToSeq(currentCommand, repeatCommand);
                break;
            }
            case NODE_BEGIN:
            default:
        }

        var prevCommand = jsConverter.commandsStack.pop();
        
        jsConverter.currentCommand = concatSeqs(prevCommand, currentCommand);
    }
};

var NODE_CREATE     = new ResultNode(TR.commands.create);
var NODE_GET_COLOR_UNDER_TAIL = new FirstParamIsVariableResultNode(
                                            TR.commands.getColorUnderTail);
var NODE_GET_X      = new FirstParamIsVariableResultNode(TR.commands.getX);
var NODE_GET_Y      = new FirstParamIsVariableResultNode(TR.commands.getY);
var NODE_GET_ANGLE  = new FirstParamIsVariableResultNode(TR.commands.getAngle);

var NODE_GO         = new FirstParamIsVariableNode(TR.commands.go);
var NODE_ROTATE     = new FirstParamIsVariableNode(TR.commands.rotate);
var NODE_TAIL_UP    = new FirstParamIsVariableNode(TR.commands.tailUp);
var NODE_TAIL_DOWN  = new FirstParamIsVariableNode(TR.commands.tailDown);
var NODE_SET_WIDTH  = new FirstParamIsVariableNode(TR.commands.setWidth);
var NODE_SET_COLOR  = new FirstParamIsVariableNode(TR.commands.setColor);
var NODE_SET_X      = new FirstParamIsVariableNode(TR.commands.setX);
var NODE_SET_Y      = new FirstParamIsVariableNode(TR.commands.setY);
var NODE_SET_ANGLE  = new FirstParamIsVariableNode(TR.commands.setAngle);
var NODE_CAPS_ROUND = new FirstParamIsVariableNode(TR.commands.capsRound);
var NODE_CAPS_SQUARE = new FirstParamIsVariableNode(TR.commands.capsSquare);
var NODE_CLEAR_CANVAS = new SimpleNode(TR.commands.clearCanvas);

//==== JsConverter =======================================================
var JsVariable = function(value)
{
    this.value = value;
};

var JsConverter = function(tortoiseRunner)
{
    this.tortoiseRunner = tortoiseRunner;
    this.nodesStack = [];
    this.commandsStack = [];
    this.currentCommand = seq();
};
JsConverter.prototype.parseNode = function(node, var_args)
{
    this.result = null;
    var jcNode = new JcNode(node, arguments);
    jcNode.process(this, jcNode);
    if(this.nodesStack.length == 0)
    {
        this.tortoiseRunner.run(this.currentCommand);
        this.currentCommand = seq();
    }

    return this.result;
};
JsConverter.prototype.nodes = {
    begin:             NODE_BEGIN,
    repeat:            NODE_REPEAT,
    end:               NODE_END,
    create:            NODE_CREATE,
    go:                NODE_GO,
    setX:              NODE_SET_X,
    getX:              NODE_GET_X,
    setY:              NODE_SET_Y,
    getY:              NODE_GET_Y,
    rotate:            NODE_ROTATE,
    tailUp:            NODE_TAIL_UP,
    tailDown:          NODE_TAIL_DOWN,
    setWidth:          NODE_SET_WIDTH,
    setColor:          NODE_SET_COLOR,
    capsRound:         NODE_CAPS_ROUND,
    capsSquare:        NODE_CAPS_SQUARE,
    clearCanvas:       NODE_CLEAR_CANVAS,
    getAngle:          NODE_GET_ANGLE,
    setAngle:          NODE_SET_ANGLE,
    getColorUnderTail: NODE_GET_COLOR_UNDER_TAIL
};
ns.JsConverter = JsConverter;
});