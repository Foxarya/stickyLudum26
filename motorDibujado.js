var puntosDestino = [{
	x : 73,
	y : 400
}, {
	x : 300,
	y : 400
}, {
	x : 350,
	y : 400
}, {
	x : 400,
	y : 380
}, {
	x : 800,
	y : 300
}];

var vertices = [];
var contador = 1;
var moviendo = true;

var linea;

function calcularDistancia(a, b) {
	var Adevolver = {
		x : ( typeof a.x != "undefined") ? a.x : a.getX(),
		y : ( typeof a.y != "undefined") ? a.y : a.getY()
	};

	var Bdevolver = {
		x : ( typeof b.x != "undefined") ? b.x : b.getX(),
		y : ( typeof b.y != "undefined") ? b.y : b.getY()
	};

	return Math.sqrt(Math.pow(Adevolver.x - Bdevolver.x, 2) + Math.pow(Adevolver.y - Bdevolver.y, 2));
}

function hayColision(elementoA, elementoB) {

	var centroB = {
		x : elementoB.getX() + (elementoB.getWidth() / 2),
		y : elementoB.getY() + (elementoB.getHeight() / 2)
	};

	var mayorX = Math.max(elementoA.getX(), elementoA.getX() + elementoA.getWidth());
	var mayorY = Math.max(elementoA.getY(), elementoA.getY() + elementoA.getHeight());
	var menorX = Math.min(elementoA.getX(), elementoA.getX() + elementoA.getWidth());
	var menorY = Math.min(elementoA.getY(), elementoA.getY() + elementoA.getHeight());

	if ((centroB.x > menorX && centroB.x < mayorX) && (centroB.y > menorY && centroB.y < mayorY)) {

		return true;

	}

	return false;

}

function dibujaTodo(elemento) {
	var distancia = calcularDistancia(elemento, puntosDestino[contador]);
	var velocidad = 200;
	var tiempo = distancia / velocidad;
	var easing;

	if (contador + 1 >= puntosDestino.length) {
		easing = 'ease-out';
	} else if (contador == 1) {
		easing = 'ease-in';
	} else {
		easing = 'linear';
	}

	elemento.transitionTo({
		x : puntosDestino[contador].x,
		y : puntosDestino[contador].y,
		duration : tiempo,
		easing : easing,
		callback : function() {
			if (contador + 1 < puntosDestino.length) {
				var nuevoVertice = new Kinetic.Circle({
					x : puntosDestino[contador].x,
					y : puntosDestino[contador].y,
					radius : 10,
					opacity : debugging,
					fill : 'red',
					stroke : 'black',
					strokeWidth : 4,
					draggable : true
				});
				contador++;
				capa.add(nuevoVertice);
				capa.draw();
				vertices.push(nuevoVertice);
				dibujaTodo(nuevoVertice);
			}
		}
	});
}

function dibujaParcial(elemento) {

	moviendo = true;
	var distancia = calcularDistancia(elemento, puntosDestino[contador]);
	var velocidad = 200;
	var tiempo = distancia / velocidad;

	elemento.transitionTo({
		x : puntosDestino[contador].x,
		y : puntosDestino[contador].y,
		duration : tiempo,
		easing : 'ease-in-out',
		callback : function() {
			moviendo = false;

		}
	});

}

function indiceVertice(vertice) {
	for (var i = 0; i < puntosDestino.length; i++) {
		if (vertice.getX() == puntosDestino[i].x && vertice.getY() == puntosDestino[i].y) {
			return i;
		}
	}
	return -1;
}

function dibujarMapa() {

	var verticeA = new Kinetic.Circle({
		x : puntosDestino[0].x,
		y : puntosDestino[0].y,
		radius : 10,
		opacity : debugging,
		fill : 'red',
		stroke : 'black',
		strokeWidth : 4
	});

	var verticeB = new Kinetic.Circle({
		x : puntosDestino[0].x,
		y : puntosDestino[0].y,
		radius : 10,
		opacity : debugging,
		fill : 'red',
		stroke : 'black',
		strokeWidth : 4
	});
	
	var pasados = [];
	linea = new Kinetic.Spline({
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
	pasados.push(0);

	capa.add(linea);
	capa.add(verticeA);
	capa.add(verticeB);

	escenario.add(capa);

	
	animacion = new Kinetic.Animation(function() {

		var puntos = [];

		for (var i = 0; i < vertices.length; i++) {
			puntos.push({
				x : vertices[i].getX(),
				y : vertices[i].getY()
			});
		}

		linea.setPoints(puntos);

		var distancias = [];

		for (var i = 0; i < vertices.length; i++) {

			var distancia = calcularDistancia(prota, vertices[i]);

			distancias.push({
				distancia : distancia,
				indice : i
			});

		}

		distancias.sort(function(a, b) {
			if (a.distancia < b.distancia)
				return -1;
			if (a.distancia > b.distancia)
				return 1;
			return 0;
		});

		var masCercano = distancias[0];

		if (masCercano.distancia < 300 && pasados.indexOf(masCercano.indice) == -1 && !moviendo && contador + 1 < puntosDestino.length) {

			pasados.push(masCercano.indice);
			contador = indiceVertice(vertices[masCercano.indice]);
			var nuevoVertice = new Kinetic.Circle({
				x : puntosDestino[contador].x,
				y : puntosDestino[contador].y,
				radius : 10,
				opacity : debugging,
				fill : 'red',
				stroke : 'black',
				strokeWidth : 4,
				draggable : true
			});
			
			contador++;
			capa.add(nuevoVertice);
			capa.draw();
			vertices.push(nuevoVertice);
			dibujaParcial(nuevoVertice);
		}

	}, capa);

	animacion.start();

	dibujaParcial(verticeB);

};
