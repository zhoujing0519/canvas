var $ = function(id){
	var target = document.querySelectorAll(id);
	if(target.length === 1){
		return document.querySelector(id);
	}else{
		return Array.prototype.slice.call(target, 0);
	}
};

var cvs = $("#canvas"),
	ctx = cvs.getContext("2d"),
	eraseAllButton = $("#eraseAllButton"),
	strokeStyleSelect = $("#strokeStyleSelect"),
	sidesSelect = $("#sidesSelect"),
	startAngleSelect = $("#startAngleSelect"),
	fillStyleSelect = $("#fillStyleSelect"),
	fillCheckbox = $("#fillCheckbox"),
	editCheckbox = $("#editCheckbox"),
	guidewireCheckbox = $("#guidewireCheckbox"),

	drawingSurfaceImageData,

	mousedown = {},
	rubberbandRect = {},

	dragging = false,
	draggingOffestX,
	draggingOffestY,

	guidewires = guidewireCheckbox.checked,
	editing = false,
	polygons = [];

// Functions...................................................................................

// 画网格
function drawGrid(color, stepx, stepy){
	ctx.strokeStyle = color;
    ctx.lineWidth = 0.5;

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
}

// 将绝对坐标转换为相对坐标
function windowToCanvas(x, y){
	var bbox = cvs.getBoundingClientRect();
	return {
		x: x - bbox.left * (cvs.width / bbox.width),
		y: y - bbox.top * (cvs.height / bbox.height)
	};
}

// Save and restore drawing surface...................................................................

// 复制当前画布内容
function saveDrawingSurface(){
	drawingSurfaceImageData = ctx.getImageData(0, 0, cvs.width, cvs.height);
}

// 将复制的数据放回画布
function restoreDrawingSurface(){
	ctx.putImageData(drawingSurfaceImageData, 0, 0);
}

// Draw a polygon

function drawPolygon(polygon){
	ctx.beginPath();
	polygon.createPath(ctx);
	polygon.stroke(ctx);

	if(fillCheckbox.checked){
		polygon.fill(ctx);
	}
}

// Rubber bands........................................................................................

// 更新橡皮筋框的宽高，坐标
function updateRubberbandRectangle(loc){
	rubberbandRect.width = Math.abs(loc.x - mousedown.x);
	rubberbandRect.height = Math.abs(loc.y - mousedown.y);

	rubberbandRect.left = loc.x > mousedown.x ? mousedown.x : loc.x;
	rubberbandRect.top = loc.y > mousedown.y ? mousedown.y : loc.y;
}

// 把橡皮筋框的对角线画出来
// function drawRubberbandShape(loc){
// 	ctx.beginPath();

// 	ctx.moveTo(mousedown.x, mousedown.y);
// 	ctx.lineTo(loc.x, loc.y);

// 	ctx.stroke();
// }

function drawRubberbandShape(){
	var polygon = new Polygon(
			mousedown.x,
			mousedown.y,
			rubberbandRect.width,
			parseInt(sidesSelect.value),
			(Math.PI / 180) * parseInt(startAngleSelect.value),
			ctx.strokeStyle,
			ctx.fillStyle,
			fillCheckbox.checked
		);

	drawPolygon(polygon);

	if(!dragging){
		polygons.push(polygon);
	}
}

function updateRubberband(loc){
	updateRubberbandRectangle(loc);
	// drawRubberbandShape(loc);
	// drawRubberbandShapeCircle(loc);
	drawRubberbandShape();
}

// 画圆
function drawRubberbandShapeCircle(loc){
	var angle, 
		radius;

	//Horizontal Line
	if(mousedown.y === loc.y){
		radius = Math.abs(loc.x - mousedown.x);
	}else{
		angle = Math.atan(rubberbandRect.height / rubberbandRect.width);
		radius = rubberbandRect.height / Math.sin(angle);
	}

	ctx.beginPath();
	ctx.arc(mousedown.x, mousedown.y, radius, 0, Math.PI*2, false);
	ctx.stroke();

	if(fillCheckbox.checked){
		ctx.fill();
	}
}

// Guidewires.............................................................................................

// 把引导线横坐标画出来
function drawHorizontalLine(y){
	ctx.beginPath();

	ctx.moveTo(0, y + 0.5);
	ctx.lineTo(ctx.canvas.width, y + 0.5);

	ctx.stroke();
}
// 把引导线纵坐标画出来
function drawVerticalLine(x){
	ctx.beginPath();

	ctx.moveTo(x + 0.5, 0);
	ctx.lineTo(x + 0.5, ctx.canvas.height);

	ctx.stroke();
}

function drawGuidewires(x, y){
	ctx.save();

	ctx.strokeStyle = "rgba(0, 0, 230, 0.4)";
	ctx.lineWidth = 0.5;
	drawHorizontalLine(y);
	drawVerticalLine(x);

	ctx.restore();
}

function drawPolygons(){
	polygons.forEach(function(polygon){
		drawPolygon(polygon);
	});
}

// Dragging...................................................................................

function startDragging(loc){
	saveDrawingSurface();

	mousedown.x = loc.x;
	mousedown.y = loc.y;
}

function startEditing(){
	cvs.style.cursor = "pointer";
	editing = true;
}

function stopEditing(){
	cvs.style.cursor = "crossshair";
	editing = false;
}

// Canvas event handlers........................................................................................

cvs.onmousedown = function(e){
	var loc = windowToCanvas(e.clientX, e.clientY);

	e.preventDefault(); //Prevent cursor change

	if(editing){
		polygons.forEach(function(polygon){
			polygon.createPath(ctx);

			if(ctx.isPointInPath(loc.x, loc.y)){
				startDragging(loc);
				dragging = polygon;
				draggingOffestX = loc.x - polygon.x;
				draggingOffestY = loc.y - polygon.y;
				return;
			}
		});
	}else{
		startDragging(loc);
		dragging = true;
	}

	// saveDrawingSurface();
	// mousedown.x = loc.x;
	// mousedown.y = loc.y;
	// dragging = true;
};

cvs.onmousemove = function(e){
	var loc = windowToCanvas(e.clientX, e.clientY);

	e.preventDefault(); // Prevent selections

	if(editing && dragging){

		dragging.x = loc.x - draggingOffestX;
		dragging.y = loc.y - draggingOffestY;

		ctx.clearRect(0, 0, cvs.width, cvs.height);

		ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
		ctx.shadowOffsetX = 2;
		ctx.shadowOffsetY = 2;
		ctx.shadowBlur = 4;
		
		drawGrid("lightgray", 10, 10);
		drawPolygons();
		
		// restoreDrawingSurface();
		// updateRubberband(loc);

		// if(guidewires){
		// 	drawGuidewires(loc.x, loc.y);
		// }
	}else{
		if(dragging){
			restoreDrawingSurface();
			updateRubberband(loc);

			if(guidewires){
				drawGuidewires(loc.x, loc.y);
			}
		}
	}

};

cvs.onmouseup = function(e){
	var loc = windowToCanvas(e.clientX, e.clientY);

	dragging = false;

	if(editing){

	}else{
		restoreDrawingSurface();
		updateRubberband(loc);
	}

};

// Controller event handlers.......................................................................................

eraseAllButton.onclick = function(e){
	ctx.clearRect(0, 0, cvs.width, cvs.height);

	drawGrid("lightgray", 10, 10);

	ctx.strokeStyle = strokeStyleSelect.value;
	ctx.fillStyle = fillStyleSelect.value;

	saveDrawingSurface();
};

strokeStyleSelect.onchange = function(e){
	ctx.strokeStyle = strokeStyleSelect.value;
};

fillStyleSelect.onchange = function(e){
	ctx.fillStyle = fillStyleSelect.value;
};

guidewireCheckbox.onchange = function(e){
	guidewires = guidewireCheckbox.checked;
};

editCheckbox.onchange = function(e){
	if(editCheckbox.checked){
		startEditing();
	}else{
		stopEditing();
	}
};

// Initialization.....................................................................................................

ctx.strokeStyle = strokeStyleSelect.value;
ctx.fillStyle = fillStyleSelect.value;

ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
ctx.shadowOffsetX = 2;
ctx.shadowOffsetY = 2;
ctx.shadowBlur = 4;

drawGrid("lightgray", 10, 10);