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
var contador = 0;
var moviendo = false;

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
				//capa.draw();
				vertices.push(nuevoVertice);
				dibujaTodo(nuevoVertice);
			}
		}
	});
}

function dibujaParcial(elemento) {

	moviendo = true;
	var moviendoA = false, moviendoB = false;

	if (contador + 1 < puntosDestino.length) {
		moviendoA = true;

		var nuevoVertice = new Kinetic.Circle({
			x : elemento.nodo.getX(),
			y : elemento.nodo.getY(),
			radius : 10,
			opacity : debugging,
			fill : 'red',
			stroke : 'black',
			strokeWidth : 4
		});

		capa.add(nuevoVertice);
		vertices.push(nuevoVertice);

		var distancia = calcularDistancia(nuevoVertice, puntosDestino[contador + 1]);
		var velocidad = 200;
		var tiempo = distancia / velocidad;

		nuevoVertice.transitionTo({
			x : puntosDestino[contador + 1].x,
			y : puntosDestino[contador + 1].y,
			duration : tiempo,
			easing : 'ease-in-out',
			callback : function() {
				moviendoA = false;
				moviendo = (!moviendoA && !moviendoB) ? false : true;

			}
		});
	}

	if (contador - 1 >= 0) {
		moviendoB = true;
		var anterior = vertices[elemento.indice - 1];
		var distancia = calcularDistancia(anterior, puntosDestino[contador]);
		var velocidad = 200;
		var tiempo = distancia / velocidad;

		anterior.transitionTo({
			x : puntosDestino[contador].x,
			y : puntosDestino[contador].y,
			duration : tiempo,
			easing : 'ease-in-out',
			callback : function() {
				anterior.destroy();
				vertices.splice(elemento.indice - 1, 1);
				capa.draw();
				moviendoB = false;
				moviendo = (!moviendoA && !moviendoB) ? false : true;

			}
		});
	}

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

	var primerVertice = new Kinetic.Circle({
		x : puntosDestino[0].x,
		y : puntosDestino[0].y,
		radius : 10,
		opacity : debugging,
		fill : 'red',
		stroke : 'black',
		strokeWidth : 4
	});

	linea = new Kinetic.Spline({
		points : [{
			x : primerVertice.getX(),
			y : primerVertice.getY()
		}],
		stroke : 'black',
		strokeWidth : 10,
		lineCap : 'round',
		tension : 0.4
	});

	vertices.push(primerVertice);

	capa.add(linea);
	capa.add(primerVertice);

	escenario.add(capa);

	var verticePasado = 0;
	tickDibujo = new Kinetic.Animation(function() {

		var puntos = [];

		for (var i = 0; i < vertices.length; i++) {
			puntos.push({
				x : vertices[i].getX(),
				y : vertices[i].getY()
			});
		}

		linea.setPoints(puntos);

		if (!moviendo) {

			var distancias = [];

			for (var i = 0; i < vertices.length; i++) {

				var distancia = calcularDistancia(prota.nodo, vertices[i]);

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

			/*if (masCercano.distancia < 300 && pasados.indexOf(masCercano.indice) == -1 && !moviendo && contador + 1 < puntosDestino.length) {

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
			 }*/

			if (masCercano.distancia < 100 && verticePasado != masCercano.indice) {

				verticePasado = masCercano.indice;
				contador = indiceVertice(vertices[masCercano.indice]);
				dibujaParcial({
					nodo : vertices[masCercano.indice],
					indice : masCercano.indice
				});

			}
		}

	}, capa);

	tickDibujo.start();
	dibujaParcial({
		nodo : primerVertice,
		indice : 0
	});

};
