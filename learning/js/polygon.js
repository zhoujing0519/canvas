// Pointer constructor

var Point = function(x, y){
	this.x = x;
	this.y = y;
};

// Polygon constructor

var Polygon = function(centerX, centerY, radius, sides, startAngle, strokeStyle, fillStyle, filled){
	this.x = centerX;
	this.y = centerY;
	this.radius = radius;
	this.sides = sides;
	this.startAngle = startAngle;
	this.strokeStyle = strokeStyle;
	this.fillStyle = fillStyle;
	this.filled = filled;
};

// Polygon prototype

Polygon.prototype.getPoints = function(){
	var points = [],
		angle = this.startAngle || 0;

	for(var i = 0; i < this.sides; ++i){

		points.push(new Point(this.x + this.radius * Math.sin(angle), this.y - this.radius * Math.cos(angle)));

		angle += Math.PI * 2 / this.sides;
	}

	return points;
};

Polygon.prototype.createPath = function(ctx){
	var points = this.getPoints();

	ctx.beginPath();
	ctx.moveTo(points[0].x, points[0].y);

	for(var i = 0; i < this.sides; ++i){
		ctx.lineTo(points[i].x, points[i].y);
	}

	ctx.closePath();
};

Polygon.prototype.stroke = function(ctx){
	ctx.save();

	this.createPath(ctx);
	ctx.strokeStyle = this.strokeStyle;
	ctx.stroke();

	ctx.restore();
};

Polygon.prototype.fill = function(ctx){
	ctx.save();

	this.createPath(ctx);
	ctx.fillStyle = this.fillStyle;
	ctx.fill();

	ctx.restore();
};

Polygon.prototype.move = function(x, y){
	this.x = x;
	this.y = y;
};