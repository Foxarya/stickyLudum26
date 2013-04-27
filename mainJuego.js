var dictImg = {};

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

var debugging = 1;

var capa = new Kinetic.Layer();

var prota;

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
						dibujarMapa();
					}
				};

				imagen.src = "img/" + nombreImagen + ".png";
			});
		}
	});

}

function logicaJuego() {
	prota = new Personaje(90, 310, dictImg['Sticky']);
	capa.add(prota);
	//capa.add(prota.rectangulo);
	prota.setId("#prota");
	$('#container').attr('tabindex', 0);
	$('#container').keydown(function(e) {
		if (e.keyCode == 39) {
			prota.setAnimation("walkr");
			prota.transitionTo({
				x : prota.getX() + 40,
				duration : 0.3,
				easing : 'linear',
				//callback : function() {
				//	prota.setAnimation("idler");
				//}
			});

		}
		if (e.keyCode == 37) {
			prota.setAnimation("walkl");
			prota.transitionTo({
				x : prota.getX() - 40,
				duration : 0.3,
				easing : 'linear',
				//callback : function() {
				//	prota.setAnimation("idlel");
				//}
			});
		}
		e.preventDefault();
		// to stop the key events from bubbling up
	});
	$('#container').keyup(function(e) {
		if (e.keyCode == 39) {
			prota.transitionTo({
				x : prota.getX() + 5,
				duration : 0.1,
				easing : 'ease-out'
			});
			prota.setAnimation("idler");
		}
		if (e.keyCode == 37) {
			prota.transitionTo({
				x : prota.getX() - 5,
				duration : 0.1,
				easing : 'ease-out'
			});
			prota.setAnimation("idlel");
		}
		e.preventDefault();
		// to stop the key events from bubbling up
	});

	capa.draw();
	prota.start();
}

function Personaje(x, y, imagen) {
	this.x = x;
	this.y = y;
	var rectangulo = new Kinetic.Rect({
		x : x + 5,
		y : y + 5,
		width : 30,
		height : 78,
		stroke : '#000',
		strokeWidth : 2,
		fill : '#ddd',
	});
	capa.add(rectangulo);
	var animations = {
		walkr : [{
			x : 0,
			y : 0,
			width : 50,
			height : 90
		}],
		idler : [{
			x : 50,
			y : 0,
			width : 40,
			height : 85
		}],
		punchr : [{
			x : 100,
			y : 0,
			width : 140,
			height : 85
		}],
		jumpr : [{
			x : 5,
			y : 100,
			width : 40,
			height : 80,
		}, {
			x : 50,
			y : 80,
			width : 50,
			height : 100,
		}],
		walkl : [{
			x : 245,
			y : 0,
			width : 45,
			height : 90
		}],
		idlel : [{
			x : 200,
			y : 0,
			width : 45,
			height : 90
		}],
		punchl : [{
			x : 150,
			y : 0,
			width : 140,
			height : 85
		}],
		jumpl : [{
			x : 245,
			y : 100,
			width : 40,
			height : 80,
		}, {
			x : 195,
			y : 80,
			width : 50,
			height : 100,
		}],
	};
	var blob = new Kinetic.Sprite({
		x : x,
		y : y,
		image : imagen,
		animation : 'idler',
		animations : animations,
		frameRate : 7,
		index : 0
	});
	return blob;

}


