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

$(document).ready(function() {

	var puntosDestino = [{
		x : 73,
		y : 160
	}, {
		x : 300,
		y : 160
	}];

	var blueSpline = new Kinetic.Spline({
		points : [{
			x : 73,
			y : 160
		}, {
			x : 80,
			y : 160
		}],
		stroke : 'black',
		strokeWidth : 10,
		lineCap : 'round',
		tension : 1
	});

	var verticeA = new Kinetic.Circle({
		x : 73,
		y : 160,
		radius : 10,
		fill : 'red',
		stroke : 'black',
		strokeWidth : 4,
		draggable: true
	});

	var verticeB = new Kinetic.Circle({
		x : 300,
		y : 160,
		radius : 10,
		fill : 'red',
		stroke : 'black',
		strokeWidth : 4,
		draggable: true
	});
	
	capa.add(blueSpline);
	capa.add(verticeA);
	capa.add(verticeB);

	escenario.add(capa);

	var animacion = new Kinetic.Animation(function(frame) {
		
		var puntos = [];
		
		puntos[0] = {
			x: verticeA.getX(),
			y: verticeA.getY()
		};
		
		puntos[1] = {
			x: verticeB.getX(),
			y: verticeB.getY()
		};
		
		blueSpline.setPoints(puntos);
		
	}, capa);

	animacion.start();

});
