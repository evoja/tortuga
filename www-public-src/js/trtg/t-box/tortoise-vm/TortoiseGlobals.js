om.ns_run("trtg.tbox.tortoise_vm", function(ns)
{
/**
@constructor trtg.tbox.tortoise_vm.TortoiseGlobals
@description
Пользователе и черепахоориентированный интерфейс к JsConverter.
Передний край нашей программы.

Здесь определяются те команды, которым мы учим детей.
Посредством этих команд обычные люди управляют черепахой.

В абстрактном плане, это больше похоже на лексический анализатор.
Этот кусок программы принимает команды в виде элементарных вызовов,
который могут служить аналогом символов,
А на выходе получается набор лексем, который потом скармливается
в синтаксический анализатор - JsConverter.

В нашей программе команды для Tortoise вызываются самим пользователем:
* либо из консоли,
* либо из файла, который подгружается пользователем кнопочкой "Открыть файл"

@example
var globals = angular.element(document.getElementById('t_box_module')).injector().get('tbox_tortoisevm_tortoise-globals');
var t = createTortoise();
t.rotate(45);
t.tailDown().go(10).tailUp().go(10).tailDown().go(10).rotate(-45);
repeat(30);
    t.go(2).rotate(90).go(2).rotate(-90);
end();
*/

var TR = om.ns_get("trtg.tbox.tortoise_vm.TortoiseRunner");

var slice = Array.prototype.slice;
/**
Метод для работы с объектом arguments.
Это такие упрощённые массивы, у которых нету некоторых полезных методов, 
вот и приходится извращаться.
*/
var prependArgumentsByObject = function(obj, oargs)
{
    var nargs = slice.apply(oargs)
    nargs.unshift(obj)
    return nargs
};

var createJsTortoise = function(jsConverter, x, y, color, width, style_caps)
{
    return jsConverter.parseNode(jsConverter.nodes.create, x, y, color, width, style_caps);
};

var getColorUnderTail = function(jsConverter, jsTortoise, forward)
{
    return jsConverter.parseNode(jsConverter.nodes.getColorUnderTail, jsTortoise, forward).value;
};

var getX = function(jsConverter, jsTortoise)
{
    return jsConverter.parseNode(jsConverter.nodes.getX, jsTortoise).value;
};

var getY = function(jsConverter, jsTortoise)
{
    return jsConverter.parseNode(jsConverter.nodes.getY, jsTortoise).value;
};
var getCoords = function(jsConverter, jsTortoise)
{
    return {
        x: jsConverter.parseNode(jsConverter.nodes.getX, jsTortoise).value, 
        y: jsConverter.parseNode(jsConverter.nodes.getY, jsTortoise).value
    };
};

var setCoords = function(jsConverter, jsTortoise, x, y)
{
    if (typeof x == "number")
    {
        jsConverter.parseNode(jsConverter.nodes.setX, jsTortoise, x);
        jsConverter.parseNode(jsConverter.nodes.setY, jsTortoise, y);
    } else 
    {
        jsConverter.parseNode(jsConverter.nodes.setX, jsTortoise, x.x);
        jsConverter.parseNode(jsConverter.nodes.setY, jsTortoise, x.y);
    }
        
};

var getAngle = function(jsConverter, jsTortoise)
{
    return jsConverter.parseNode(jsConverter.nodes.getAngle, jsTortoise).value;
};


//==== Construction helpers ====
var applyMethodsToProto = function (methods, proto, wrapMethod)
{
    for(var key in methods)
    {
        proto[key] = wrapMethod(methods[key]);
    }
};

var wrapTortoiseProtoMethod = function(node, jsConverter)
{
    return function()
    {
        var args = prependArgumentsByObject(this.jsTortoise, arguments);
        args = prependArgumentsByObject(node, args);
        jsConverter.parseNode.apply(jsConverter, args);
        return this;
    };
};

var wrapNode = function(node, jsConverter)
{
    return function()
    {
        var args = prependArgumentsByObject(node, arguments);
        return jsConverter.parseNode.apply(jsConverter, args);
    };
};

var constructProto = function(jsConverter)
{
    return {
        go: jsConverter.nodes.go,
        rotate: jsConverter.nodes.rotate,
        tailUp: jsConverter.nodes.tailUp,
        tailDown: jsConverter.nodes.tailDown,
        setColor: jsConverter.nodes.setColor,
        setWidth: jsConverter.nodes.setWidth,
        capsRound: jsConverter.nodes.capsRound,
        capsSquare: jsConverter.nodes.capsSquare,
        setX: jsConverter.nodes.setX,
        getX: jsConverter.nodes.getX,
        setY: jsConverter.nodes.setY,
        getY: jsConverter.nodes.getY,
        getAngle: jsConverter.nodes.getAngle,
        setAngle: jsConverter.nodes.setAngle,
    };
};


ns.TortoiseGlobals = function(jsConverter)
{
    var Tortoise = function(xx, yy, color, width, style_caps)
    {
        xx = xx === undefined ? 0 : xx;
        yy = yy === undefined ? 0 : yy;
        color = color || "#0a0";
        width = width || 1;
        style_caps = style_caps || "round";

        this.jsTortoise = createJsTortoise(jsConverter, xx, yy, color, width, style_caps);
    };

    applyMethodsToProto(constructProto(jsConverter), Tortoise.prototype,
        function(node){return wrapTortoiseProtoMethod(node, jsConverter)});

    Tortoise.prototype.getColorUnderTail = function(forward)
    {
        return getColorUnderTail(jsConverter, this.jsTortoise, forward);
    };
    Tortoise.prototype.getX = function()
    {
        return getX(jsConverter, this.jsTortoise);
    };
    Tortoise.prototype.getY = function()
    {
        return getY(jsConverter, this.jsTortoise);
    };
    Tortoise.prototype.getCoords = function()
    {
        return getCoords(jsConverter, this.jsTortoise);
    };
    Tortoise.prototype.setCoords = function(x, y)
    {
        return setCoords(jsConverter, this.jsTortoise, x, y);
    };
    Tortoise.prototype.getAngle = function()
    {
        return getAngle(jsConverter, this.jsTortoise);
    };

    var proto = Tortoise.prototype;
    proto.fw = proto.go;
    proto.forward = proto.go;
    proto.lt = proto.rotate;
    proto.rt = function(deg){return this.rotate(deg ? -deg : 0)}
    proto.up = proto.tailUp;
    proto.dw = proto.tailDown;


    clearCanvas = wrapNode(jsConverter.nodes.clearCanvas, jsConverter);
    begin = wrapNode(jsConverter.nodes.begin, jsConverter);
    repeat = wrapNode(jsConverter.nodes.repeat, jsConverter);
    end = wrapNode(jsConverter.nodes.end, jsConverter);

    createTortoise = function(xx, yy, color, width, style_caps)
    {
        return new Tortoise(xx, yy, color, width, style_caps, jsConverter);
    };
};

});