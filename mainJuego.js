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
						logicaJuego();
					}
				};	
				imagen.src = "img/" + nombreImagen + ".png";	
			});
		}
	});
}

function logicaJuego(){	
      var prota = new Personaje(50,50,dictImg['Sticky']);
}

function Personaje(x,y,imagen){
	this.x = x;
	this.y = y;
	var image = new Image();
	image.src = imagen;
	capa.add(image);
	var animations = {
        idle: [{
        	x: 10,
        	y: 5,
        	width: 130,
        	height: 285
        }],
        stat: [{
        	x: 230,
        	y: 5,
        	width: 130,
        	height: 285,
        }],
        punch: [{
        	x: 330,
        	y: 5,
        	width: 200,
        	height: 285
        }],
        jump: [{
        	x: 10,
        	y: 325,
        	width: 130,
        	height: 265,
        },{
        	x: 230,
        	y: 300,
        	width: 130,
        	height: 285,
    	}]
    };
	var blob = new Kinetic.Sprite({
          x: 250,
          y: 40,
          image: imageObj,
          animation: 'idle',
          animations: animations,
          frameRate: 7,
          index: 0
        });
        blob.start();
}

Personaje.prototype.mover = function(){
	
}

