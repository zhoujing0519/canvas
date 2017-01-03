var cvs = document.getElementById("canvas"),
	ctx = cvs.getContext("2d"),

	strokeStyleSelect = document.getElementById("strokeStyleSelect"),
	fillStyleSelect = document.getElementById("fillStyleSelect"),
	drawRadio = document.getElementById("drawRadio"),
	eraseRadio = document.getElementById("eraseRadio"),
	eraserShapeSelect = document.getElementById("eraserShapeSelect"),
	eraserWidthSelect = document.getElementById("eraserWidthSelect"),

	ERASER_LINE_WIDTH = 1,
	ERASER_STROKE_STYLE = "rgb(0, 0, 255)",
	ERASER_SHADOW_COLOR = "rgb(0, 0, 0)",
	ERASER_SHADOW_STYLE = "blue",
	ERASER_SHADOW_OFFSET = - 5,
	ERASER_SHADOW_BLUR = 20,

	GRID_SPACING = 10,
	GRID_LINE_COLOR = "lightblue",

	drawingSurfaceImageDate,

	lastX,
	lastY,
	mousedown = {},
	rubberbandRect = {},
	dragging = false,
	guidewires = true;

// Functions.................................................................................

	function drawGrid(color, stepX, stepY){
		ctx.strokeStyle = color;
		ctx.lineWidth = 0.5;

		for(var i = 0.5 + stepX; i < cvs.width; i += stepX){
			ctx.beginPath();
			ctx.moveTo(i, 0);
			ctx.lineTo(i, cvs.height);
			ctx.stroke();
		}

		for(var j = 0.5 + stepY; j < cvs.height; j += stepY){
			ctx.beginPath();
			ctx.moveTo(0, j);
			ctx.lineTo(cvs.width, j);
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

	// Saving and restore drawing surface.....................................................

	function saveDrawingSurface(){
		drawingSurfaceImageDate = ctx.getImageData(0, 0, cvs.width, cvs.height);
	}

	function restoreDrawingSurface(){
		ctx.putImageData(drawingSurfaceImageDate, 0, 0);
	}

	// Rubber bands...........................................................................

	function updateRubberbandRectangle(loc){
		rubberbandRect.left = loc.x > mousedown.x ? mousedown.x : loc.x;
		rubberbandRect.top = loc.y > mousedown.y ? mousedown.y : loc.y;
		rubberbandRect.width = Math.abs(loc.x - mousedown.x);
		rubberbandRect.height = Math.abs(loc.y - mousedown.y);
	}

	function drawRubberbandShape(loc){
		var angle = Math.atan(rubberbandRect.height / rubberbandRect.width),
			radius = rubberbandRect.height / Math.sin(angle);

		if(mousedown.y === loc.y){
			radius = Math.abs(loc.x - mousedown.x);
		}

		ctx.beginPath();
		ctx.arc(mousedown.x, mousedown.y, radius, 0, Math.PI * 2, false);
		ctx.stroke();
		ctx.fill();
	}

	function updateRubberband(loc){
		updateRubberbandRectangle(loc);
		drawRubberbandShape(loc);
	}

	// Guidewires.................................................................................

	function drawHorizontalGuidewire(y){
		ctx.beginPath();
		ctx.moveTo(0, y + 0.5);
		ctx.lineTo(cvs.width, y + 0.5);
		ctx.stroke();
	}

	function drawVerticalGuidewire(x){
		ctx.beginPath();
		ctx.moveTo(x + 0.5, 0);
		ctx.lineTo(x + 0.5, cvs.height);
		ctx.stroke();
	}

	function drawGuidewires(x, y){
		ctx.save();

		ctx.strokeStyle = "lightgray";
		ctx.lineWidth = 0.5;
		drawHorizontalGuidewire(y);
		drawVerticalGuidewire(x);

		ctx.restore();
	}

	// Eraser.....................................................................................

	function setDrawPathForEraser(loc){
		var eraserWidth = parseInt(eraserWidthSelect.value);

		ctx.beginPath();

		if(eraserShapeSelect.value === "circle"){
			ctx.arc(loc.x, loc.y, eraserWidth / 2, 0, Math.PI * 2, false);
		}else{
			ctx.rect(loc.x - eraserWidth / 2, loc.y - eraserWidth / 2, eraserWidth, eraserWidth);
		}

		ctx.clip();
	}

	function setErasePathForEraser(){
		var eraserWidth = parseInt(eraserWidthSelect.value);

		ctx.beginPath();

		if(eraserShapeSelect.value === "circle"){
			ctx.arc(lastX, lastY, eraserWidth / 2, 0, Math.PI * 2, false);
		}else{
			ctx.rect(lastX - eraserWidth / 2 - ERASER_LINE_WIDTH, lastY - eraserWidth / 2 - ERASER_LINE_WIDTH, eraserWidth + ERASER_LINE_WIDTH * 2, eraserWidth + ERASER_LINE_WIDTH * 2);
		}

		ctx.clip();
	}

	function setEraserAttributes(){
		ctx.lineWidth = ERASER_LINE_WIDTH;
		// ctx.shadowColor = ERASER_SHADOW_COLOR;
		// ctx.shadowOffsetX = ERASER_SHADOW_OFFSET;
		// ctx.shadowOffsetY = ERASER_SHADOW_OFFSET;
		// ctx.shadowBlur = ERASER_SHADOW_BLUR;
		// ctx.strokeStyle = ERASER_STROKE_STYLE;
		ctx.strokeStyle = "#fff";
	}

	function eraseLast(){
		ctx.save();

		setErasePathForEraser();
		ctx.fillStyle = "#fff";
		ctx.fillRect(0, 0, cvs.width, cvs.height);
		drawGrid(GRID_LINE_COLOR, GRID_SPACING, GRID_SPACING);

		ctx.restore();
	}

	function drawEraser(loc){
		ctx.save();

		setEraserAttributes();
		setDrawPathForEraser(loc);
		ctx.stroke();

		ctx.restore();
	}

// Canvas event handlers.....................................................................................

cvs.onmousedown = function(e){
	e.preventDefault();

	var loc = windowToCanvas(e.clientX, e.clientY);

	if(drawRadio.checked){
		saveDrawingSurface();
	}

	mousedown.x = loc.x;
	mousedown.y = loc.y;

	lastX = loc.x;
	lastY = loc.y;

	dragging = true;
};

cvs.onmousemove = function(e){
	var loc;

	if(dragging){
		e.preventDefault();

		loc = windowToCanvas(e.clientX, e.clientY);

		if(drawRadio.checked){
			restoreDrawingSurface();
			updateRubberband(loc);

			if(guidewires){
				drawGuidewires(loc.x, loc.y);
			}
		}else{
			eraseLast();
			drawEraser(loc);
		}

		lastX = loc.x;
		lastY = loc.y;
	}
};

cvs.onmouseup = function(e){
	var loc = windowToCanvas(e.clientX, e.clientY);

	if(drawRadio.checked){
		restoreDrawingSurface();
		updateRubberband(loc);
	}

	if(eraseRadio.checked){
		eraseLast();
	}

	dragging = false;
};

// Controls event handlers..............................................................................

strokeStyleSelect.onchange = function(e){
	ctx.strokeStyle = strokeStyleSelect.value;
};

fillStyleSelect.onchange = function(e){
	ctx.fillStyle = fillStyleSelect.value;
};

// Initialization.......................................................................................

ctx.fillStyle = "#fff";
ctx.fillRect(0, 0, cvs.width, cvs.height);
ctx.strokeStyle = strokeStyleSelect.value;
ctx.fillStyle = fillStyleSelect.value;
drawGrid(GRID_LINE_COLOR, GRID_SPACING, GRID_SPACING);