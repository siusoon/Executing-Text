//Daniel shiffman's Steering Behaviors: https://www.youtube.com/watch?v=4hA7G3gup-4

var font;
var vehicles = [];
var texts = ['自由'];

function preload() {
	font = loadFont('data/wt005.ttf');
}

function setup() {
	createCanvas(500,500);
	background(0);
	
	var points = font.textToPoints(texts[0], width/4.9, height/2, 150);  //convert to objects in points (text, x, y, size)
	for (var i = 0; i<points.length; i++) {
		var pt = points[i];
		var vehicle = new Vehicle(pt.x, pt.y);
		vehicles.push(vehicle);
	}
}

function draw() {
	background(0);
	for (var i = 0; i < vehicles.length; i++) {
		var v = vehicles[i];
		v.behaviors();
		v.update();
		v.show();
	}
}

function Vehicle(x,y) {
	this.pos = createVector(random(width),random(height));
	this.target = createVector(x,y);
	this.vel = p5.Vector.random2D();
	this.acc = createVector();
	this.maxspeed = 1.5;  //for desired velocity
	this.maxforce = 1.09;
}

//IMPORTANT FUNCTION AS BEHAVIORS (either arrive/seek)

Vehicle.prototype.behaviors = function() {
	var seek = this.seek(this.target);
	this.applyForce(seek);
}

Vehicle.prototype.seek = function(target) {
	var desired = p5.Vector.sub(target, this.pos);
	desired.setMag(this.maxspeed);
	var steer = p5.Vector.sub(desired, this.vel);
	steer.limit(this.maxforce);
	return steer;
}

Vehicle.prototype.arrive = function(target) {   //more static
	var desired = p5.Vector.sub(target, this.pos);
	var d = desired.mag();
	var speed = this.maxspeed;
	if (d < 100) {  //pixel
		speed = map(d,0,100,0, this.maxspeed);
	}
	desired.setMag(speed);
	var steer = p5.Vector.sub(desired, this.vel);
	steer.limit(this.maxforce);
	return steer;
}

Vehicle.prototype.applyForce = function(f) {
	this.acc.add(f);
}

Vehicle.prototype.update = function() {
	this.pos.add(this.vel);
	this.vel.add(this.acc);
	this.acc.mult(0);  //clear acceleration
}

Vehicle.prototype.show = function () {
		stroke(255,255,0);
		strokeWeight(5);
		point(this.pos.x, this.pos.y);
}