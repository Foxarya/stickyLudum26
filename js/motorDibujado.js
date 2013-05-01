var puntosDestino = [{
	x : 73,
	y : 300
}, {
	x : 300,
	y : 300
}, {
	x : 600,
	y : 300
}, {
	x : 800,
	y : 300
}, {
	x : 1000,
	y : 300
}];

var vertices = [];
var contador = 0;
var moviendo = false;

var capaDibujado = new Kinetic.Layer();

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
				capaDibujado.add(nuevoVertice);
				//capaDibujado.draw();
				vertices.push(nuevoVertice);
				dibujaTodo(nuevoVertice);
			}
		}
	});
}

function dibujaParcial(elemento) {

	if (elemento.indicePunto + 1 < puntosDestino.length) {

		var vertice = vertices[verticeIndice(elemento.indicePunto + 1)];

		if (vertice == null) {
			vertice = new Kinetic.Circle({
				x : elemento.nodo.getX(),
				y : elemento.nodo.getY(),
				radius : 10,
				opacity : debugging,
				fill : 'red',
				stroke : 'black',
				strokeWidth : 4
			});

			capaDibujado.add(vertice);
			vertices.push({
				nodo : vertice,
				indicePunto : elemento.indicePunto + 1
			});

			var distancia = calcularDistancia(vertice, puntosDestino[elemento.indicePunto + 1]);
			var velocidad = 200;
			var tiempo = distancia / velocidad;

			vertice.transitionTo({
				x : puntosDestino[elemento.indicePunto + 1].x,
				y : puntosDestino[elemento.indicePunto + 1].y,
				duration : tiempo,
				easing : 'ease-in-out'
			});
		}
	}

	if (elemento.indicePunto - 1 >= 0) {

		var vertice = vertices[verticeIndice(elemento.indicePunto - 1)];

		if (vertice == null) {
			vertice = new Kinetic.Circle({
				x : elemento.nodo.getX(),
				y : elemento.nodo.getY(),
				radius : 10,
				opacity : debugging,
				fill : 'red',
				stroke : 'black',
				strokeWidth : 4
			});

			capaDibujado.add(vertice);
			vertices.splice(0, 0, {
				nodo : vertice,
				indicePunto : elemento.indicePunto - 1
			});

			var distancia = calcularDistancia(vertice, puntosDestino[elemento.indicePunto - 1]);
			var velocidad = 200;
			var tiempo = distancia / velocidad;

			vertice.transitionTo({
				x : puntosDestino[elemento.indicePunto - 1].x,
				y : puntosDestino[elemento.indicePunto - 1].y,
				duration : tiempo,
				easing : 'ease-in-out'
			});
		}
	}

	var borradas = 0;
	var puntosABorrar = [];

	for (var i = 0; i < vertices.length; i++) {
		var punto = vertices[i].indicePunto;

		if (punto >= elemento.indicePunto - 1 && punto <= elemento.indicePunto + 1)
			continue;

		var dondeAvanzo = (punto < elemento.indicePunto) ? punto + 1 : punto - 1;

		/*var vertice = vertices[i].nodo;

		var distancia = calcularDistancia(vertice, puntosDestino[dondeAvanzo]);
		var velocidad = 200;
		var tiempo = distancia / velocidad;

		puntosABorrar.push(i);

		vertice.transitionTo({
			x : puntosDestino[dondeAvanzo].x,
			y : puntosDestino[dondeAvanzo].y,
			duration : tiempo,
			easing : 'ease-in-out',
			callback : function() {
				vertices.splice(puntosABorrar[0], 1);
				puntosABorrar.splice(0, 1);
				this.destroy();
			}
		});*/
		
		vertices[i].nodo.destroy();
		vertices.splice(i, 1);
		i--;

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

function verticeIndice(indice) {
	for (var i = 0; i < vertices.length; i++) {
		if (vertices[i].nodo.getX() == puntosDestino[indice].x && vertices[i].nodo.getY() == puntosDestino[indice].y) {
			return i;
		}
	}
	return null;
}

function dibujarMapa() {

	escenario.add(capaDibujado);

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

	vertices.push({
		nodo : primerVertice,
		indicePunto : 0
	});

	capaDibujado.add(linea);
	capaDibujado.add(primerVertice);
	

	var verticePasado = 0;
	tickDibujo = new Kinetic.Animation(function() {
		

		var puntos = [];

		for (var i = 0; i < vertices.length; i++) {
			puntos.push({
				x : vertices[i].nodo.getX(),
				y : vertices[i].nodo.getY()
			});
		}

		linea.setPoints(puntos);

		if (!moviendo) {

			var distancias = [];

			for (var i = 0; i < vertices.length; i++) {

				var distancia = calcularDistancia(prota.nodo, puntosDestino[vertices[i].indicePunto]);

				distancias.push({
					distancia : distancia,
					indicePuntoDestino : vertices[i].indicePunto,
					indiceVertice : i
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

			if (masCercano.distancia < 100 && verticePasado != masCercano.indicePuntoDestino) {

				verticePasado = masCercano.indicePuntoDestino;
				dibujaParcial(vertices[masCercano.indiceVertice]);

			}
		}

	}, capaDibujado);

	dibujaParcial(vertices[0]);
	tickDibujo.start();

};
