
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
	cargarImagenes();
	
});

function cargarImagenes() {
	$.ajax({
		type : "GET",
		url : "images.xml",
		dataType : "xml",
		success : function(xml) {
			var compruebaCargadas;
			var numeroImagenes = $(xml).find('imagen').length;
			$(xml).find('imagen').each(function() {
				var nombreImagen = $(this).text();
				
				var imagen = new Image();
				imagen.onload = function() {
					dictImg[nombreImagen] = imagen;
					
					compruebaCargadas += ".";
					if (compruebaCargadas.length == numeroImagenes) {
						//logicaJuego();
					}
				};	
				imagen.src = "img/" + nombreImagen + ".png";	
			});
		}
	});
}

function logicaJuego(){
	
}

var animations = {
        idle: [{
        	x: 2,
        	y: 2,
        	width: 70,
        	height: 119
        }],
        stat: [{
        	x: 2,
        	y: 2,
        	width: 2,
        	height:2 ,
        }],
        punch: [{
        	x: 2,
        	y: 138,
        	width: 74,
        	height: 122
        }],
        jump: [{
        	x: 2,
        	y: 2,
        	width: 2,
        	height: 2,
        }]
      };