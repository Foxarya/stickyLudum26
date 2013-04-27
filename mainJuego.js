
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

function cargarImagenes() {
	$.ajax({
		type : "GET",
		url : "images.xml",
		dataType : "xml",
		success : function(xml) {
			debug("hola");
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