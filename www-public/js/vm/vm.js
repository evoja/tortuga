ns("Tortuga.Vm.");

Tortuga.Vm.initVm = function(canvas, tortoiseContainer)
{
	return new Tortuga.Vm.DrawingSystem(canvas, tortoiseContainer)
}