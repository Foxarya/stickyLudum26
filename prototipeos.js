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

var puntosDestino = [{
	x : 73,
	y : 160
}, {
	x : 300,
	y : 160
},
{
	x: 350,
	y: 100
},
{
	x: 400,
	y: 90
},
{
	x: 800,
	y: 130
}];

var vertices = [];
var contador = 1;

function mover(elemento) {
	elemento.transitionTo({
		x : puntosDestino[contador].x,
		y : puntosDestino[contador].y,
		duration : 1,
		easing : 'ease-in-out',
		callback : function() {
			if (contador + 1 < puntosDestino.length) {
				var nuevoVertice = new Kinetic.Circle({
					x : puntosDestino[contador].x,
					y : puntosDestino[contador].y,
					radius : 10,
					fill : 'red',
					stroke : 'black',
					strokeWidth : 4,
					draggable : true
				});
				contador++;
				capa.add(nuevoVertice);
				capa.draw();
				vertices.push(nuevoVertice);
				mover(nuevoVertice);
			}
		}
	});
}


$(document).ready(function() {

	var verticeA = new Kinetic.Circle({
		x : 73,
		y : 160,
		radius : 10,
		fill : 'red',
		stroke : 'black',
		strokeWidth : 4
	});

	var verticeB = new Kinetic.Circle({
		x : 73,
		y : 160,
		radius : 10,
		fill : 'red',
		stroke : 'black',
		strokeWidth : 4
	});
	
	var blueSpline = new Kinetic.Spline({
		points : [{
			x : verticeA.getX(),
			y : verticeA.getY()
		}],
		stroke : 'black',
		strokeWidth : 10,
		lineCap : 'round',
		tension : 0.4
	});

	vertices.push(verticeA);
	vertices.push(verticeB);

	capa.add(blueSpline);
	capa.add(verticeA);
	capa.add(verticeB);

	escenario.add(capa);

	var animacion = new Kinetic.Animation(function(frame) {

		var puntos = [];
		
		for(var i = 0; i < vertices.length;i++)
		{
			puntos.push({
				x: vertices[i].getX(),
				y: vertices[i].getY()
			});
		}

		blueSpline.setPoints(puntos);

	}, capa);

	animacion.start();
	
	mover(verticeB);

});
