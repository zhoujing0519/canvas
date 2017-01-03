var cvs = document.getElementById("canvas"),
	ctx = cvs.getContext("2d"),
	eraseAllButton = document.getElementById("eraseAllButton"),
	strokeStyleSelect = document.getElementById("strokeStyleSelect"),
	guidewireCheckbox = document.getElementById("guidewireCheckbox"),

	drawingSurfaceImageData,
	mousedown = {},
	rubberbandRect = {},
	dragging = false,
	guidewires = guidewireCheckbox.checked;

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

// Rubber bands........................................................................................

// 更新橡皮筋框的宽高，坐标
function updateRubberbandRectangle(loc){
	rubberbandRect.width = Math.abs(loc.x - mousedown.x);
	rubberbandRect.height = Math.abs(loc.y - mousedown.y);

	rubberbandRect.left = loc.x > mousedown.x ? mousedown.x : loc.x;
	rubberbandRect.top = loc.y > mousedown.y ? mousedown.y : loc.y;
}

// 把橡皮筋框的对角线画出来
function drawRubberbandShape(loc){
	ctx.beginPath();

	ctx.moveTo(mousedown.x, mousedown.y);
	ctx.lineTo(loc.x, loc.y);

	ctx.stroke();
}

function updateRubberband(loc){
	updateRubberbandRectangle(loc);
	// drawRubberbandShape(loc);
	drawRubberbandShapeCircle(loc);
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

// Canvas event handlers........................................................................................

cvs.onmousedown = function(e){
	var loc = windowToCanvas(e.clientX, e.clientY);

	e.preventDefault(); //Prevent cursor change

	saveDrawingSurface();
	mousedown.x = loc.x;
	mousedown.y = loc.y;
	dragging = true;
};

cvs.onmousemove = function(e){
	var loc;

	if(dragging){
		e.preventDefault(); // Prevent selections

		loc = windowToCanvas(e.clientX, e.clientY);
		restoreDrawingSurface();
		updateRubberband(loc);

		if(guidewires){
			drawGuidewires(loc.x, loc.y);
		}
	}

};

cvs.onmouseup = function(e){
	var loc = windowToCanvas(e.clientX, e.clientY);

	restoreDrawingSurface();
	updateRubberband(loc);
	dragging = false;
};

// Controller event handlers.......................................................................................

eraseAllButton.onclick = function(e){
	ctx.clearRect(0, 0, cvs.width, cvs.height);

	drawGrid("lightgray", 10, 10);

	ctx.strokeStyle = strokeStyleSelect.value;

	saveDrawingSurface();
};

strokeStyleSelect.onchange = function(e){
	ctx.strokeStyle = strokeStyleSelect.value;
};

guidewireCheckbox.onchange = function(e){
	guidewires = guidewireCheckbox.checked;
};

// Initialization.....................................................................................................

ctx.strokeStyle = strokeStyleSelect.value;
drawGrid("lightgray", 10, 10);