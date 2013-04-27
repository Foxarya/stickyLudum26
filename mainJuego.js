
var escenario = new Kinetic.Stage({
	container : 'container',
	width : 900,
	height : 575,
	draggable : true,
	dragBoundFunc : function(pos) {
		return {
			x : this.getAbsolutePosition().x,
			y : this.getAbsolutePosition().y
		}
	}
});

var capa = new Kinetic.Layer();

$(document).ready(function () {
	
	
	
	escenario.add(capa);
	
});
