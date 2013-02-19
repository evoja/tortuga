var RepeatTortoise;
(function(){
	//==== Layer and Item ==============
	var Layer = function(parentLayer, count)
	{
		this.count = count;
		this.parentLayer = parentLayer;
		this.calls = []
		this.isLayer = true;
	}
	Layer.prototype.isLayer = true;
	Layer.prototype.pushName = function(name, args)
	{
		this.calls.push({name: name, args: args, isLayer: false})
	}
	Layer.prototype.pushLayer = function(count)
	{
		var layer = new Layer(this, count);
		this.calls.push(layer);
		return layer;
	}
	Layer.prototype.draw = function(t)
	{
		var calls = this.calls;
		var size = calls.length;
		for(var c = 0; c < this.count; ++c)
		{
			for(var i = 0; i < size; ++i)
			{
				var call = calls[i];
				if(call.isLayer)
				{
					call.draw(t);
				}
				else
				{
					t[call.name].apply(t, call.args);
				}
			}
		}
	}

	//==== Construction ======
	var createNames = function(proto)
	{
		var names = [];
		for(var key in proto)
		{
			names.push(key);
		}
		return names;
	}

	var wrapProtoMethod = function(name)
	{
		return function()
		{
			this.layer.pushName(name, arguments);
			return this;
		}		
	}

	var wrapProtoMethods = function(sourceNames, targetProto, wrapMethod)
	{
		console.log("wrap");
		var size = sourceNames.length;
		for(var i = 0; i < size; ++i)
		{
			console.log(sourceNames[i]);
			targetProto[sourceNames[i]] = wrapMethod(sourceNames[i])
		}
	}

	RepeatTortoise = function(tortoise, count)
	{
		this.tortoise = tortoise;
		this.layer = new Layer(null, count);
	}
	wrapProtoMethods(createNames(Tortoise.prototype), 
		RepeatTortoise.prototype, wrapProtoMethod);
	RepeatTortoise.prototype.repeat = function(count)
	{
		var layer = this.layer.pushLayer(count);
		this.layer = layer;
		return this;
	}
	RepeatTortoise.prototype.end = function()
	{
		var parent = this.layer.parentLayer;
		if(parent)
		{
			this.layer = parent;
			return this;
		}
		else
		{
			this.layer.draw(this.tortoise);
			return this.tortoise;
		}
	}

})()