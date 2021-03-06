var cvs = document.getElementById("canvas"),
	ctx = cvs.getContext("2d"),

	eraseAllButton = document.getElementById("eraseAllButton"),
	strokeStyleSelect = document.getElementById("strokeStyleSelect"),
	guidewireCheckbox = document.getElementById("guidewireCheckbox"),
	instructions = document.getElementById("instructions"),
	instructionsOkayButton = document.getElementById("instructionsOkayButton"),
	instructionsNoMoreButton = document.getElementById("instructionsNoMoreButton"),

	showInstructions = true;

const AXIS_MARGIN = 40,
	  HORIZONTAL_TICK_SPACING = 10,
	  VERTICAL_TICK_SPACING = 10,
	  TICK_SIZE = 10,

	  AXIS_ORIGIN = {
	  	x: AXIS_MARGIN,
	  	y: cvs.height - AXIS_MARGIN
	  },
	  AXIS_TOP = AXIS_MARGIN,
	  AXIS_RIGHT = cvs.width - AXIS_MARGIN,
	  AXIS_WIDTH = AXIS_RIGHT - AXIS_ORIGIN.x,
	  AXIS_HEIGHT = AXIS_ORIGIN.y - AXIS_TOP,

	  NUM_VERTICAL_TICKS = AXIS_HEIGHT / VERTICAL_TICK_SPACING,
	  NUM_HORIZONTAL_TICKS = AXIS_WIDTH / HORIZONTAL_TICK_SPACING,

	  GRID_STROKE_STYLE = "lightgray",
	  GRID_SPACING = 10,

	  CONTROL_POINT_RADIUS = 5,
	  CONTROL_STROKE_STYLE = "blue",
	  CONTROL_FILL_STYLE = "rgba(255, 255, 0, 0.5)",

	  END_POINT_STROKE_STYLE = "navy",
	  END_POINT_FILL_STYLE = "rgba(0, 255, 0, 0.5)",

	  GUIDEWIRE_STROKE_STYLE = "rgba(0, 0, 230, 0.4)";

var drawingImageData, //Image data stored on mouse down events
	mousedown = {}, //cursor location for last mousedown event
	rubberbandRect = {}, //constantly updated for mouse move events

	dragging = false, //If true, user is dargging the cursor
	draggingPoint = false, //End- or control point user is dargging

	endpoints = [{}, {}], //Endpoint locations (x, y)
	controlPoints = [{}, {}], //Control point locations (x, y)
	editing = false, //If true, user is editing the curve

	guidewires = guidewireCheckbox.checked;

//Functions.................................................................................................

function drawGrid(color, stepx, stepy){
	ctx.strokeStyle = color;
	ctx.lineWidth = 0.5;

	for(var i = 0.5; i <= ctx.canvas.width; i += stepx){
		ctx.beginPath();
		ctx.moveTo(i, 0);
		ctx.lineTo(i, ctx.canvas.height);
		ctx.stroke();
	}for(var i = 0.5; i <= ctx.canvas.height; i += stepy){
		ctx.beginPath();
		ctx.moveTo(0, i);
		ctx.lineTo(ctx.canvas.width, i);
		ctx.stroke();
	}
}

function windowToCanvas(x, y){
	var bbox = cvs.getBoundingClientRect();

	return {
		x: (x - bbox.left) * (cvs.width / bbox.width),
		y: (y - bbox.top) * (cvs.height / bbox.height)
	};
}

// Save and restore drawing surface

function saveDrawingSurface(){
	drawingImageData = ctx.getImageData(0, 0, cvs.width, cvs.height);
}

function restoreDrawingSurface(){
	ctx.putImageData(drawingImageData, 0, 0);
}

// Rubber bands

function updateRubberbandRectangle(loc){
	rubberbandRect.width = Math.abs(loc.x - mousedown.x);
	rubberbandRect.height = Math.abs(loc.y - mousedown.y);

	rubberbandRect.left = loc.x > mousedown.x ? mousedown.x : loc.x;
	rubberbandRect.top = loc.y > mousedown.y ? mousedown.y : loc.y;
}

function drawBezierCurve(){
	ctx.beginPath();
	ctx.moveTo(endpoints[0].x, endpoints[0].y);
	ctx.bezierCurveTo(controlPoints[0].x, controlPoints[0].y, controlPoints[1].x, controlPoints[1].y, endpoints[1].x, endpoints[1].y);
	ctx.stroke();
}

function updateEndAndControlPoints(){
	endpoints[0].x = rubberbandRect.left;
	endpoints[0].y = rubberbandRect.top;

	endpoints[1].x = rubberbandRect.left + rubberbandRect.width;
	endpoints[1].y = rubberbandRect.top + rubberbandRect.height;

	controlPoints[0].x = rubberbandRect.left;
	controlPoints[0].y = rubberbandRect.top + rubberbandRect.height;

	controlPoints[1].x = rubberbandRect.left + rubberbandRect.width;
	controlPoints[1].y = rubberbandRect.top;
}

function drawRubberbandShape(loc){
	updateEndAndControlPoints();
	drawBezierCurve();
}

function updateRubberband(loc){
	updateRubberbandRectangle(loc);
	drawRubberbandShape(loc);
}

// Guidewire..................................................................................................

function drawHorizontalGuidewire(y){
	ctx.beginPath();
	ctx.moveTo(0, y + 0.5);
	ctx.lineTo(ctx.canvas.width, y + 0.5);
	ctx.stroke();
}

function drawVerticalGuidewire(x){
	ctx.beginPath();
	ctx.moveTo(x + 0.5, 0);
	ctx.lineTo(x + 0.5, ctx.canvas.height);
	ctx.stroke();
}

function drawGuidewires(x, y){
	ctx.save();
	ctx.strokeStyle = GUIDEWIRE_STROKE_STYLE;
	ctx.lineWidth = 0.5;
	drawVerticalGuidewire(x);
	drawHorizontalGuidewire(y);
	ctx.restore();
}

// EndPoints and controlPoints................................................................................

function drawControlPoint(index){
	ctx.beginPath();
	ctx.arc(controlPoints[index].x, controlPoints[index].y, CONTROL_POINT_RADIUS, 0, Math.PI * 2, false);
	ctx.stroke();
	ctx.fill();
}

function drawControlPoints(){
	ctx.save();
	ctx.strokeStyle = CONTROL_STROKE_STYLE;
	ctx.fillStyle = CONTROL_FILL_STYLE;
	drawControlPoint(0);
	drawControlPoint(1);
	ctx.stroke();
	ctx.fill();
	ctx.restore();
}

function drawEndPoint(index){
	ctx.beginPath();
	ctx.arc(endpoints[index].x, endpoints[index].y, CONTROL_POINT_RADIUS, 0, Math.PI * 2, false);
	ctx.stroke();
	ctx.fill();
}

function drawEndPoints(){
	ctx.save();
	ctx.strokeStyle = END_POINT_STROKE_STYLE;
	ctx.fillStyle = END_POINT_FILL_STYLE;
	drawEndPoint(0);
	drawEndPoint(1);
	ctx.stroke();
	ctx.fill();
	ctx.restore();
}

function drawControlAndEndPoints(){
	drawControlPoints();
	drawEndPoints();
}

function cursorInEndPoint(loc){
	var pt;

	endpoints.forEach(function(point){
		ctx.beginPath();
		ctx.arc(point.x, point.y, CONTROL_POINT_RADIUS, 0, Math.PI * 2, false);

		if(ctx.isPointInPath(loc.x, loc.y)){
			pt = point;
		}
	});

	return pt;
}

function cursorInControlPoint(loc){
	var pt;

	controlPoints.forEach(function(point){
		ctx.beginPath();
		ctx.arc(point.x, point.y, CONTROL_POINT_RADIUS, 0, Math.PI * 2, false);

		if(ctx.isPointInPath(loc.x, loc.y)){
			pt = point;
		}
	});

	return pt;
}

function updateDraggingPoint(loc){
	draggingPoint.x = loc.x;
	draggingPoint.y = loc.y;
}

// Canvas event handlers......................................................................................

cvs.onmousedown = function(e){
	e.preventDefault();
	
	var loc = windowToCanvas(e.clientX, e.clientY);

	if(!editing){
		saveDrawingSurface();
		mousedown.x = loc.x;
		mousedown.y = loc.y;
		updateRubberbandRectangle(loc);
		dragging = true;
	}else{
		draggingPoint = cursorInControlPoint(loc);

		if(!draggingPoint){
			draggingPoint = cursorInEndPoint(loc);
		}
	}

};

cvs.onmousemove = function(e){

	var loc = windowToCanvas(e.clientX, e.clientY);

	if(dragging || draggingPoint){
		e.preventDefault();
		restoreDrawingSurface();

		if(guidewires){
			drawGuidewires(loc.x, loc.y);
		}
	}

	if(dragging){
		updateRubberband(loc);
		drawControlAndEndPoints();
	}else if(draggingPoint){
		updateDraggingPoint(loc);
		drawControlAndEndPoints();
		drawBezierCurve();
	}

};

cvs.onmouseup = function(e){

	var loc = windowToCanvas(e.clientX, e.clientY);

	restoreDrawingSurface();

	if(!editing){
		updateRubberband(loc);
		drawControlAndEndPoints();
		dragging = false;
		editing = true;
		if(showInstructions){
			instructions.style.display = "inline";
		}
	}else{

		if(draggingPoint){
			drawControlAndEndPoints();
		}else{
			editing = false;
		}

		drawBezierCurve();
		draggingPoint = undefined;
	}
};

// Control event handlers.....................................................................................

eraseAllButton.onclick = function(e){
	ctx.clearRect(0, 0, cvs.width, cvs.height);
	drawGrid(GRID_STROKE_STYLE, GRID_SPACING, GRID_SPACING);

	saveDrawingSurface();

	editing = false;
	dragging = false;
	draggingPoint = undefined;
};

strokeStyleSelect.onchange = function(e){
	ctx.strokeStyle = strokeStyleSelect.value;
};

guidewireCheckbox.onchange = function(e){
	guidewires = guidewireCheckbox.checked;
};

// Instructions event handlers................................................................................

instructionsOkayButton.onclick = function(e){
	instructions.style.display = "none";
};

instructionsNoMoreButton.onclick = function(e){
	instructions.style.display = "none";
	showInstructions = false;
};

// Initialization.............................................................................................

ctx.strokeStyle = strokeStyleSelect.value;
drawGrid(GRID_STROKE_STYLE, GRID_SPACING, GRID_SPACING);