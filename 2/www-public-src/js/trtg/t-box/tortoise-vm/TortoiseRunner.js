om.ns_run("trtg.tbox.tortoise_vm", function(ns)
{

/**
@constructor
@name trtg.tbox.tortoise_vm.TortoiseRunner
@description
Интерпретатор черепашьих команд в широком смысле.

Т.е. команды черепахи представляют из себя отдельный язык,
более близкий к LOGO, чем к JS.
Программа для черепахи - это синтаксическое дерево, составленное из разных команд.

Вот TortoiseRunner - это исполнитель дерева черепашьих команд.

В нашей программе команды для TortoiseRunner формируются и вызываются 
в JsConverter.

@example <caption>Пример использования:</caption>

var runner = angular.element(document.getElementById('t_box_module')).injector().get('tbox_tortoisevm_tortoise_runner');
// короткий доступ к библиотеке:
var Tr = runner.constructor

var t; // это будет черепаха.
// // создаём команду, создающую черепаху:
var command = Tr.constructCommand(Tr.commands.create, 0, 20, "green", 1, "round", function(tt){t = tt});

// // создаём команды опускания и поднимания хвоста:
var td = Tr.constructCommand(Tr.commands.tailDown, function(){return t})
var tu = Tr.constructCommand(Tr.commands.tailUp, function(){return t})

// // выполняем команду, черепаха создаётся:
runner.run(command)

// // создаём комадну, двигающую черепаху вперёд:
var goCommand = Tr.constructCommand(Tr.commands.go, function(){return t}, 10)

// выполняем движение черепахи.
runner.run(td)
runner.run(goCommand)
runner.run(tu)
runner.run(goCommand)
runner.run(td)
runner.run(goCommand)
runner.run(tu)
runner.run(goCommand)
runner.run(td)
runner.run(goCommand)

@example <caption>Пример использования последовательностей:</caption>

fun = function(n)
{
    var m1 = new Date().getTime()
    var runner = angular.element(document.getElementById('t_box_module')).injector().get('tbox_tortoisevm_tortoise_runner');
    var Tr = runner.constructor;
    var t;
    var command = Tr.constructCommand(Tr.commands.create, 0, 0, "green", 1, "round",
    	function(trTortoise)
    	{
    		t = trTortoise
    	})
    runner.run(command)
    var get_t = function(){return t;};
    var pair = function(f, s){return Tr.constructCommand(Tr.commands.pair, f, s)}

    var td = Tr.constructCommand(Tr.commands.tailDown, get_t)
    var tu = Tr.constructCommand(Tr.commands.tailUp, get_t)
    var right = Tr.constructCommand(Tr.commands.rotate, get_t, -90)
    var left = Tr.constructCommand(Tr.commands.rotate, get_t, 90)

    var go = Tr.constructCommand(Tr.commands.go, get_t, 3)
    var kill = Tr.constructCommand(Tr.commands.kill, get_t)
    var nil = Tr.constructCommand(Tr.commands.nil)

    var seq = pair(nil, td)
    for(var i = 0; i < n;++i)
    {
       seq = pair(pair(pair(pair(seq, left), go), right), go)
    }
    seq = pair(seq, kill)
    runner.run(seq)
    var m2 = new Date().getTime()
    return m2 - m1
}

fun(500)

fun2 = function(n)
{
    var m1 = new Date().getTime()
    var runner = angular.element(document.getElementById('t_box_module')).injector().get('tbox_tortoisevm_tortoise_runner');
    var Tr = runner.constructor;
    var t
    var command = Tr.constructCommand(Tr.commands.create, 0, 0, "green", 1, "round", 
                           function(trTortoise){t = trTortoise})
    runner.run(command)
    var get_t = function(){return t;};

    var td = Tr.constructCommand(Tr.commands.tailDown, get_t)
    var tu = Tr.constructCommand(Tr.commands.tailUp, get_t)
    var right = Tr.constructCommand(Tr.commands.rotate, get_t, -90)
    var left = Tr.constructCommand(Tr.commands.rotate, get_t, 90)

    var go = Tr.constructCommand(Tr.commands.go, get_t, 3)
    var kill = Tr.constructCommand(Tr.commands.kill, get_t)

    var seq1 = Tr.constructCommand(Tr.commands.seq, [left, go, right, go])
    var repeat = Tr.constructCommand(Tr.commands.repeat, n, seq1)
    var seq = Tr.constructCommand(Tr.commands.seq, [td, repeat, kill])
    runner.run(seq)
    var m2 = new Date().getTime()
    return m2 - m1
}

fun2(10000)

*/

var TR_POINT_MOVE = {move_:1};
var TR_POINT_LINE = {line_:1};
var CAPS_ROUND = "round"
var CAPS_SQUARE = "butt"

//=== Math ===
var degToRad = function(deg)
{
    return deg / 180 * Math.PI;
};

//==== TortoiseRunner's language =====
var TrTortoise = function(x, y, color, width, style_caps, dsTortoise)
{
    this.dsTortoise = dsTortoise;
    this.x = x;
    this.y = y;
    this.deg = 0;
    this.isDrawing = false;
    this.color = color;
    this.width = width || 1;
    this.style_caps = style_caps || CAPS_ROUND;
};


var TrPoint = function(trTortoise, moveOrLine)
{
    this.trTortoise = trTortoise;
    this.x = trTortoise.x;
    this.y = trTortoise.y;
    this.color = trTortoise.color;
    this.width = trTortoise.width;
    this.style_caps = trTortoise.style_caps;
    this.moveOrLine = moveOrLine
};
TrPoint.prototype.equals = function(that)
{
    return this.x == that.x && this.y == that.y && 
        this.color == that.color && this.width == that.width &&
        this.style_caps == that.style_caps &&
        this.trTortoise == that.trTortoise;
};

var appendPointToRunner = function(runner, trPoint)
{
    var points = runner.points;

    if(points.length == 0 || trPoint.moveOrLine == TR_POINT_LINE)
    {
        points.push(trPoint);
        return;
    };

    var last = points[points.length - 1];

    if(last.moveOrLine == TR_POINT_MOVE)
    {
        points.pop();
        return appendPointToRunner(runner, trPoint);
    };

    if(!last.equals(trPoint))
    {
        points.push(trPoint);
        return;
    };
};

var placeAllTortoises = function(runner)
{
    var ds = runner.drawingSystem;
    runner.tortoises.forEach(function(trt)
    {
        ds.placeTortoise(
            trt.dsTortoise, 
            trt.x, trt.y, trt.deg,
            trt.isDrawing, trt.color);
    });
};

var drawAllLines = function(runner)
{
    var ds = runner.drawingSystem;
    var moved = false;
    runner.points.forEach(function(trPoint)
    {
        if(trPoint.moveOrLine == TR_POINT_MOVE)
        {
            if(moved)
            {
               ds.stroke();
            }
            else
            {
                moved = true;
            }

            ds.beginPath();
            ds.setColor(trPoint.color);
            ds.setWidth(trPoint.width);
            ds.setCapsStyle(trPoint.style_caps);
            ds.moveTo(trPoint.x, trPoint.y);
        }
        else
        {
            ds.lineTo(trPoint.x, trPoint.y);
        }
    });

    if(moved)
    {
        ds.stroke();
    }
};


var runCreate = function runCreate(runner, x, y, color, width, style_caps, handler)
{
    var dsTortoise = runner.drawingSystem.createTortoise();
    var trTortoise = new TrTortoise(x, y, color, width, style_caps, dsTortoise);
    runner.tortoises.push(trTortoise);
    handler(trTortoise);
};

var runClearCanvas = function runClearCanvas(runner)
{
    runner.drawingSystem.clearCanvas();
};

var runGo = function runGo(runner, getTrTortoise, length)
{
    length = length || 0;
    var trTortoise = getTrTortoise();
    var isDrawing = trTortoise.isDrawing;

    if(isDrawing)
    {
        appendPointToRunner(runner, new TrPoint(trTortoise, TR_POINT_MOVE));
    }

    var rad = degToRad(trTortoise.deg);
    trTortoise.x += length * Math.cos(rad);
    trTortoise.y += length * Math.sin(rad);

    if(isDrawing)
    {
        appendPointToRunner(runner, new TrPoint(trTortoise, TR_POINT_LINE));
    }
};

var runTailDown = function runTailDown(runner, getTrTortoise)
{
    getTrTortoise().isDrawing = true;
};

var runTailUp = function runTailUp(runner, getTrTortoise)
{
    getTrTortoise().isDrawing = false;
}

var runRotate = function runRotate(runner, getTrTortoise, deg)
{
    deg = deg || 0;
    getTrTortoise().deg += deg;
};

var runSetColor = function runSetColor(runner, getTrTortoise, color)
{
    getTrTortoise().color = color;
};

var runSetX = function runSetX(runner, getTrTortoise, x)
{
    getTrTortoise().x = x;
};

var runGetX = function runSetX(runner, getTrTortoise, handler)
{
    handler(getTrTortoise().x);
};

var runSetY = function runSetX(runner, getTrTortoise, y)
{
    getTrTortoise().y = y;
};

var runGetY = function runSetX(runner, getTrTortoise, handler)
{
    handler(getTrTortoise().y);
};

var runGetAngle = function runGetAngle(runner, getTrTortoise, handler)
{
    handler(getTrTortoise().deg);
};

var runSetAngle = function runGetAngle(runner, getTrTortoise, deg)
{
    getTrTortoise().deg = deg;
};

var runCapsSquare = function runCapsSquare(runner, getTrTortoise)
{
    getTrTortoise().style_caps = CAPS_SQUARE;
};

var runCapsRound = function runCapsRound(runner, getTrTortoise)
{
    getTrTortoise().style_caps = CAPS_ROUND;
};

var runSetWidth = function runSetWidth(runner, getTrTortoise, width)
{
    getTrTortoise().width = width;
};

var runGetColorUnderTail = function runGetColorUnderTail(runner, getTrTortoise, forward, handler)
{
    var trTortoise = getTrTortoise();
    forward = forward || 0;
    var rad = degToRad(trTortoise.deg);
    var x = trTortoise.x + forward * Math.cos(rad);
    var y = trTortoise.y + forward * Math.sin(rad);
    handler(runner.drawingSystem.getColorAt(x, y));
};

var runKill = function runKill(runner, getTrTortoise)
{
    var trTortoise = getTrTortoise();
    var tortoises = runner.tortoises;
    var index = tortoises.indexOf(trTortoise);

    if(index == -1)
       return;

    tortoises.splice(index, 1);
    runner.drawingSystem.destroyTortoise(trTortoise.dsTortoise);
};

var runNil = function runNil(runner){};

var runPair = function runPair(runner, first, second)
{
    first(runner);
    second(runner);
};

var runSeq = function runSeq(runner, arr)
{
    arr.forEach(function(command){command(runner)});
};

var runRepeat = function runRepeat(runner, n, command)
{
    for(var i = 0; i < n; ++i)
    {
       command(runner);
    }
};

var constructCommand = function()
{
    var realCommand = arguments[0];
    var args = arguments;
    var command = function(runner)
    {
        args[0] = runner;
        realCommand.apply(null, args);
        args[0] = realCommand;
    }
    command.args = args;
    return command;
};

var appendCommandToSeq = function(seq, command)
{
    seq.args[1].push(command);
};

var concatSeqs = function(seq1, seq2)
{
    var commands = seq1.args[1].concat(seq2.args[1]);
    return constructCommand(runSeq, commands);
};

//==== TortoiseRunner =======================================================

var TortoiseRunner = function(drawingSystem)
{
    this.drawingSystem = drawingSystem;
    this.tortoises = [];
};

TortoiseRunner.prototype = {
    constructor: TortoiseRunner,
    run : function(command)
    {
        var runner = this;
        runner.points = [];
        var ds = runner.drawingSystem;

        command(runner);
        drawAllLines(runner);
        placeAllTortoises(runner);
    }
};

TortoiseRunner.commands = {
    create   : runCreate,
    clearCanvas : runClearCanvas,
    go       : runGo,
    tailDown : runTailDown,
    tailUp   : runTailUp,
    rotate   : runRotate,
    setColor : runSetColor,
    setWidth : runSetWidth,
    setX     : runSetX,
    getX     : runGetX,
    setY     : runSetY,
    getY     : runGetY,
    getAngle : runGetAngle,
    setAngle : runSetAngle,
    capsRound : runCapsRound,
    capsSquare : runCapsSquare,
    kill     : runKill,
    nil      : runNil,
    pair     : runPair,
    seq      : runSeq,
    repeat   : runRepeat,
    getColorUnderTail : runGetColorUnderTail
};
TortoiseRunner.constructCommand = constructCommand;
TortoiseRunner.appendCommandToSeq = appendCommandToSeq;
TortoiseRunner.concatSeqs = concatSeqs;

ns.TortoiseRunner = TortoiseRunner;


});