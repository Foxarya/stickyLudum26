var dictImg = {};

var escenario = new Kinetic.Stage({
	container : 'container',
	width : 900,
	height : 575
});

var debugging = 1;

var capa = new Kinetic.Layer();

var prota, world, context, nodos = [];

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

function initBox2d() {

	context = document.getElementById("debugCanvas").getContext('2d');

	// Define the world
	world = new b2World(new b2Vec2(0, 10)//gravity of 10 in downward y direction
	, true //allows objects to sleep if they are in equilibrium, indicated by change of color from Red to Grey in debugDraw mode
	);
	
	
	// Define the Ground
	// Basic properties of ground
	var fixDef = new b2FixtureDef;
	fixDef.density = 2.0;
	fixDef.friction = 0;
	fixDef.restitution = 0;

	// Ground is nothing but just a static rectangular body with its center at screenW/2 and screenH
	var bodyDef = new b2BodyDef;
	bodyDef.type = b2Body.b2_staticBody;
	bodyDef.position.x = escenario.getWidth() / 2 / scale;
	// We use screenH for y coordinate as the ground has to be at the bottom of our screen
	bodyDef.position.y = escenario.getHeight() / scale;

	// here we define ground as a rectangular box of width = screenW and height = 10 (just some small number to make a thin strip)
	fixDef.shape = new b2PolygonShape;
	fixDef.shape.SetAsBox(escenario.getWidth() / scale, 10 / scale);

	// And finally add our ground object to our world
	world.CreateBody(bodyDef).CreateFixture(fixDef);

	var tickFisicas = new Kinetic.Animation(function(frame) {
		world.Step(1 / frame.frameRate, 3, 3);
		// timestep, velocityIterations, positionIterations. Read manual for more details
		
		// This is called after we are done with time steps to clear the forces
		world.ClearForces();

		// Traverse through all the box2d objects and update the positions and rotations of corresponding KineticJS objects
		for (var i = 0; i < nodos.length; i++) {
			var body = nodos[i].body;
			// A small hack to save on unnecessary redraws.
			if (!body.IsAwake())
				count++;

			var nodo = nodos[i].nodo;
			var p = body.GetPosition();
			nodo.setRotation(body.GetAngle());
			nodo.setPosition(p.x * scale, p.y * scale);
		}

		world.DrawDebugData();

		//capa.draw();

	}, capa);

	tickFisicas.start();

	// The native function that draws the object for us to debug their physics and visualize interaction
	var debugDraw = new b2DebugDraw();
	debugDraw.SetSprite(context);
	debugDraw.SetDrawScale(scale);
	debugDraw.SetFillAlpha(0.5);
	debugDraw.SetLineThickness(1.0);
	debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit | b2DebugDraw.e_centerOfMassBit);

	world.SetDebugDraw(debugDraw);


}

function logicaJuego() {

	prota = new Personaje(90, 310, dictImg['Sticky']);

	//prota.nodo.setId("#prota");

	//capa.add(prota.nodo);

	prota.body = world.CreateBody(prota.bodyDef);
	prota.body.CreateFixture(prota.fixDef);

	nodos.push(prota);

	$(document).keydown(function(e) {
		if (e.keyCode == 39) {
			moviendo = true;
			prota.nodo.setAnimation("walkr");
			prota.body.ApplyForce(new b2Vec2(99,0), prota.body.GetWorldCenter());
			prota.body.SetFriction(0);
			e.preventDefault();
		}
		if (e.keyCode == 37) {
			moviendo = true;
			prota.nodo.setAnimation("walkl");
			prota.body.ApplyForce(new b2Vec2(-99,0), prota.body.GetWorldCenter());
			prota.body.SetFriction(0);
			e.preventDefault();
		}

	});
	$(document).keyup(function(e) {
		if (e.keyCode == 39) {
			prota.nodo.transitionTo({
				x : prota.nodo.getX() + 5,
				duration : 0.1,
				easing : 'ease-out'
			});
			prota.nodo.setAnimation("idler");
			prota.body.SetFriction(1);
			e.preventDefault();
		}
		if (e.keyCode == 37) {
			prota.nodo.transitionTo({
				x : prota.nodo.getX() - 5,
				duration : 0.1,
				easing : 'ease-out'
			});
			prota.nodo.setAnimation("idlel");
			prota.body.SetFriction(1);
			e.preventDefault();
		}

	});

	capa.draw();
	prota.nodo.start();

}
