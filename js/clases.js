var b2Vec2 = Box2D.Common.Math.b2Vec2, b2AABB = Box2D.Collision.b2AABB, b2BodyDef = Box2D.Dynamics.b2BodyDef, b2Body = Box2D.Dynamics.b2Body, b2FixtureDef = Box2D.Dynamics.b2FixtureDef, b2Fixture = Box2D.Dynamics.b2Fixture, b2World = Box2D.Dynamics.b2World, b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape, b2CircleShape = Box2D.Collision.Shapes.b2CircleShape, b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

var scale = 20.0;

function Personaje(x, y, imagen) {
	this.x = x;
	this.y = y;
	this.jump = false;
	this.direccion = 1;
	this.grounded = false;
	this.movement = false;
	
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
		jumpr : [/*{
			x : 5,
			y : 100,
			width : 40,
			height : 80,
		},*/ {
			x : 50,
			y : 95,
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
		jumpl : [/*{
			x : 245,
			y : 100,
			width : 40,
			height : 80,
		}, */{
			x : 195,
			y : 95,
			width : 50,
			height : 100,
		}],
	};
	this.nodo = new Kinetic.Sprite({
		x : x,
		y : y,
		image : imagen,
		width: 40,
		height: 85,
		animation : 'idler',
		animations : animations,
		frameRate : 7,
		index : 0
	});
	
	this.nodo.setOffset(this.nodo.getWidth() / 2, this.nodo.getHeight() / 2);
	
	var pos = this.nodo.getAbsolutePosition();
	var off = this.nodo.getOffset();

	var fixDef = new b2FixtureDef;
	fixDef.density = 2.0;
	fixDef.friction = 0;
	fixDef.restitution = 0;

	fixDef.shape = new b2PolygonShape;
	fixDef.shape.SetAsBox(off.x / scale, off.y / scale);

	var bodyDef = new b2BodyDef;
	bodyDef.type = b2Body.b2_dynamicBody;
	
	bodyDef.fixedRotation = true;

	bodyDef.position.Set((pos.x + off.x) / scale, (pos.y + off.y) / scale);

	this.bodyDef = bodyDef;
	this.fixDef = fixDef;

}

