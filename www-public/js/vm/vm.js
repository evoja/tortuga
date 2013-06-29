ns("Tortuga.Vm.");

Tortuga.Vm.initVm = function(canvas, tortoiseContainer)
{
	var ds = new Tortuga.Vm.DrawingSystem(canvas, tortoiseContainer)
	var tr = new Tortuga.Vm.TortoiseRunner(ds)
	MyTr = tr
	return ds
}