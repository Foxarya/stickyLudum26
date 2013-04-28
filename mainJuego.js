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
var world;


var context;

//Box2d vars
var fixDef;
var bodyDef;


$(document).ready(function() {

	escenario.add(capa);
	cargarImagenes();

});

function initBox2d() {
         var   b2Vec2 = Box2D.Common.Math.b2Vec2
            ,  b2AABB = Box2D.Collision.b2AABB
         	,	b2BodyDef = Box2D.Dynamics.b2BodyDef
         	,	b2Body = Box2D.Dynamics.b2Body
         	,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
         	,	b2Fixture = Box2D.Dynamics.b2Fixture
         	,	b2World = Box2D.Dynamics.b2World
         	,	b2MassData = Box2D.Collision.Shapes.b2MassData
         	,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
         	,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
         	,	b2DebugDraw = Box2D.Dynamics.b2DebugDraw
            ,  b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef
            ;
         
        
		fixDef= new b2FixtureDef;
		fixDef.density = 1.0;
		fixDef.friction = 0.5;
		fixDef.restitution = 0.2;
  	       
		bodyDef = new b2BodyDef;
		context = document.getElementById('debugCanvas').getContext('2d');
}
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
						initBox2d();
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
	// Inicializacion fisicas
	
	world = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(0, 10), true);
	// 73,400 300, 400
	
	var debugDraw = new Box2D.Dynamics.b2DebugDraw();
		debugDraw.SetSprite(context);
		debugDraw.SetDrawScale(20);
		debugDraw.SetFillAlpha(0.5);
		debugDraw.SetLineThickness(1.0);
		debugDraw.SetFlags(Box2D.Dynamics.b2DebugDraw.e_shapeBit | Box2D.Dynamics.b2DebugDraw.e_jointBit | Box2D.Dynamics.b2DebugDraw.e_centerOfMassBit);
	
		
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
			prota.rectangulo.x += 5;
			prota.transitionTo({
				x : prota.getX() + 5,
				duration : 0.1,
				easing : 'ease-out'
			});
			prota.setAnimation("idler");
		}
		if (e.keyCode == 37) {
			prota.rectangulo.move(5, 0);
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
	world.Step(1 / 60, 3, 3);
	world.DrawDebugData();
	prota.start();
}

function Personaje(x, y, imagen) {
	this.x = x;
	this.y = y;
	var meters = pixelToMeters(x,y);
	fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape;
	bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
	//bodyDef.position.x = meters.x;
	//bodyDef.position.y = meters.y;
	bodyDef.position.x = 1;
	bodyDef.position.y = 1;
	
	var msize = pixelToMeters(1000,1000)
	fixDef.shape.SetAsBox(msize.x,msize.y);
	
	world.CreateBody(bodyDef).CreateFixture(fixDef);
	/*var rectangulo = new Kinetic.Rect({
		x : x + 5,
		y : y + 5,
		width : 30,
		height : 78,
		stroke : '#000',
		strokeWidth : 2,
		fill : '#ddd',
	});
	capa.add(rectangulo);*/
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

function update() {
	world.Step(1 / 60, 3, 3); // timestep, velocityIterations, positionIterations. Read manual for more details
	if(debugging == 1)
		world.DrawDebugData();
}

function pixelToMeters(xp,yp){
	return {x: 0.02 * xp,
			y: 0.02 * yp};	
}

function metersToPixels(xm,ym){
	return {x: 50.0 * xm,
			y: 50.0 * ym};	
}
