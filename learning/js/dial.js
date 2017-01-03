var cvs = document.getElementById("canvas"),
	ctx = cvs.getContext("2d");

const //圆心
	  CENTROID_RADIUS = 10,
	  CENTROID_STROKE_STYLE = "rgba(0, 0, 0, 0.5)",
	  CENTROID_FILL_STYLE = "rgba(80, 190, 240, 0.6)",

	  RING_INNER_RADIUS = 35,
	  RING_OUTER_RADIUS = 55,

	  // 表盘数值标注
	  ANNOTATIONS_FILL_STYLE = "rgba(0, 0, 230, 0.9)",
	  ANNOTATIONS_TEXT_SIZE = 12,

	  // 刻度
	  TICK_WIDTH = 10,
	  TICK_LONG_STROKE_STYLE = "rgba(100, 140, 230, 0.9)",
	  TICK_SHORT_STROKE_STYLE = "rgba(100, 140, 230, 0.7)",

	  TRACKING_DIAL_STROKING_STYLE = "rgba(100, 140, 230, 0.5)",

	  // 表头
	  GUIDEWIRE_STROKE_STYLE = "goldenrod",
	  GUIDEWIRE_FILL_STYLE = "rgba(250, 250, 0, 0.6)",

	  ANGLE_MAX = Math.PI * 2,

	  // 内圆
	  CIRCLE = {
	  	x: cvs.width / 2,
	  	y: cvs.height / 2,
	  	radius: 150
	  };

// Functions........................................................

// 画出网格
function drawGrid(color, stepx, stepy){
	ctx.save();

	ctx.shadowColor = undefined;
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
	ctx.strokeStyle = color;
	ctx.fillStyle = "#ffffff";
	ctx.lineWidth = 0.5;
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	for(var i = 0.5 + stepx; i < ctx.canvas.width; i += stepx){
		ctx.beginPath();
		ctx.moveTo(i, 0);
		ctx.lineTo(i, ctx.canvas.height);
		ctx.stroke();
	}

	for(var i = 0.5 + stepy; i < ctx.canvas.height; i += stepy){
		ctx.beginPath();
		ctx.moveTo(0, i);
		ctx.lineTo(ctx.canvas.width, i);
		ctx.stroke();
	}

	ctx.restore();
}

// 画出表盘
function drawDial(){
	var loc = {
		x: CIRCLE.x,
		y: CIRCLE.y
	};

	drawCentroid();
	drawRing();
	drawTickInnerCircle();
	drawTicks();
	drawAnnotations();
	drawCentroidGuidewire(loc);
}

// 画出圆心
function drawCentroid(){
	ctx.beginPath();

	ctx.save();

	ctx.strokeStyle = CENTROID_STROKE_STYLE;
	ctx.fillStyle = CENTROID_FILL_STYLE;
	ctx.arc(CIRCLE.x, CIRCLE.y, CENTROID_RADIUS, 0, Math.PI * 2, false);
	ctx.stroke();
	ctx.fill();

	ctx.restore();
}

// 画出表盘指针&&表头
function drawCentroidGuidewire(loc){
	var angle = - Math.PI / 4,
		radius,
		endpt;

	radius = CIRCLE.radius + RING_OUTER_RADIUS;

	if(loc.x >= CIRCLE.x){
		endpt = {
			x: CIRCLE.x + radius * Math.cos(angle),
			y: CIRCLE.y + radius * Math.sin(angle)
		};
	}else{
		endpt = {
			x: CIRCLE.x - radius * Math.cos(angle),
			y: CIRCLE.y - radius * Math.sin(angle)
		};
	}

	ctx.save();

	ctx.strokeStyle = GUIDEWIRE_STROKE_STYLE;
	ctx.fillStyle = GUIDEWIRE_FILL_STYLE;

	ctx.beginPath();
	ctx.moveTo(CIRCLE.x, CIRCLE.y);
	ctx.lineTo(endpt.x, endpt.y);
	ctx.stroke();

	ctx.beginPath();
	ctx.strokeStyle = TICK_SHORT_STROKE_STYLE;
	ctx.arc(endpt.x, endpt.y, 5, 0, Math.PI * 2, false);
	ctx.fill();
	ctx.stroke();

	ctx.restore();
}

// 画出表环
function drawRing(){
	// 外环逆时针
	drawRingOuterCircle();

	ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
	// 内环顺时针，根据"非零环绕规则"，内部不填充颜色，形成圆环
	ctx.arc(CIRCLE.x, CIRCLE.y, CIRCLE.radius, 0, Math.PI * 2, false);
	ctx.fillStyle = "rgba(100, 140, 230, 0.1)";
	ctx.fill();
	ctx.stroke();
}

// 画出外环
function drawRingOuterCircle(){
	ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
	ctx.shadowOffsetX = 3;
	ctx.shadowOffsetY = 3;
	ctx.shadowBlur = 6;
	ctx.strokeStyle = TRACKING_DIAL_STROKING_STYLE;

	ctx.beginPath();
	ctx.arc(CIRCLE.x, CIRCLE.y, CIRCLE.radius + RING_OUTER_RADIUS, 0, Math.PI * 2, true);
	ctx.stroke();
}

// 画出刻度环
function drawTickInnerCircle(){
	ctx.save();

	ctx.beginPath();
	ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
	ctx.arc(CIRCLE.x, CIRCLE.y, CIRCLE.radius + RING_INNER_RADIUS - TICK_WIDTH, 0, Math.PI * 2, false);
	ctx.stroke();

	ctx.restore();
}

// 循环画出刻度
function drawTicks(){
	var radius = CIRCLE.radius + RING_INNER_RADIUS,
		tickWidth;
	const ANGLE_DELTA = Math.PI / 64;

	ctx.save();

	for(var angle = 0, cnt = 0; angle < ANGLE_MAX; angle += ANGLE_DELTA, cnt++){
		drawTick(angle, radius, cnt++);
	}

	ctx.restore();
}

// 画出刻度
function drawTick(angle, radius, cnt){
	var tickWidth = cnt % 4 === 0 ? TICK_WIDTH : TICK_WIDTH / 2;

	ctx.beginPath();
	ctx.moveTo(CIRCLE.x + Math.cos(angle) * (radius - tickWidth), CIRCLE.y + Math.sin(angle) * (radius - tickWidth));
	ctx.lineTo(CIRCLE.x + Math.cos(angle) * (radius), CIRCLE.y + Math.sin(angle) * (radius));
	ctx.strokeStyle = TICK_SHORT_STROKE_STYLE;
	ctx.stroke();
}


// 画出表盘刻度数值标注
function drawAnnotations(){
	var radius = CIRCLE.radius + RING_OUTER_RADIUS;

	ctx.save();
	ctx.fillStyle = ANNOTATIONS_FILL_STYLE;
	ctx.font = ANNOTATIONS_TEXT_SIZE + "px Helvetica";

	for(var angle = 0; angle < ANGLE_MAX; angle += Math.PI / 8){
		ctx.beginPath();
		ctx.fillText((angle * 180 / Math.PI).toFixed(0), CIRCLE.x + Math.cos(angle) * (radius - TICK_WIDTH * 2), CIRCLE.y - Math.sin(angle) * (radius - TICK_WIDTH * 2));
	}

	ctx.restore();
}

// Initialization............................................................................

ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
ctx.shadowOffsetX = 2;
ctx.shadowOffsetY = 2;
ctx.shadowBlur = 4;

ctx.textAlign = "center";
ctx.textBaseline = "middle";

drawGrid("lightgray", 10, 10);
drawDial();