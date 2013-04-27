var dictImg;

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

	escenario.add(capa);
	cargarImagenes();

});

function cargarImagenes() {
	var barraCarga = new Kinetic.Rect({
		x : escenario.getWidth / 2 - 250,
		y : escenario.getHeight / 2,
		width : 0,
		height : 5,
		stroke : 'black',
		strokeWidth : 2,
		fill : 'orange'
	});
	
	capa.add(barraCarga);

	$.ajax({
		type : "GET",
		url : "images.xml",
		dataType : "xml",
		success : function(xml) {
			var cargadas = 0;
			var numeroImagenes = $(xml).find('imagen').length;
			$(xml).find('imagen').each(function() {
				var nombreImagen = $(this).text();
				var imagen = new Image();

				imagen.onload = function() {

					dictImg[nombreImagen] = imagen;
					cargadas++;
					barraCarga.transitionTo({
						width : ((cargadas * 100) / numeroImagenes) * 5,
						duration : 0.1,
						easing : 'ease-in-out'
					});
					barraCarga.draw();
					if (cargadas == numeroImagenes) {
						barraCarga.destroy();
						logicaJuego();
					}
				};

				imagen.src = "img/" + nombreImagen + ".png";
			});
		}
	});

}

function logicaJuego() {
	var prota = new Personaje(50, 50, dictImg['Sticky']);
	//capa.add(prota);

}

function Personaje(x, y, imagen) {
	this.x = x;
	this.y = y;
	var animations = {
		idle : [{
			x : 10,
			y : 5,
			width : 130,
			height : 285
		}],
		stat : [{
			x : 230,
			y : 5,
			width : 130,
			height : 285,
		}],
		punch : [{
			x : 330,
			y : 5,
			width : 200,
			height : 285
		}],
		jump : [{
			x : 10,
			y : 325,
			width : 130,
			height : 265,
		}, {
			x : 230,
			y : 300,
			width : 130,
			height : 285,
		}]
	};
	var blob = new Kinetic.Sprite({
		x : 250,
		y : 40,
		image : imagen,
		animation : 'idle',
		animations : animations,
		frameRate : 7,
		index : 0
	});
	return blob;
	capa.add(blob);
	capa.draw();
	blob.start();

}

Personaje.prototype.mover = function() {

}

