// Guidewires..............................................................

function drawHorizontalGuidewire(y){
	ctx.beginpath();
	ctx.moveTo(0, y + 0.5);
	ctx.lineTo(ctx.canvas.width, y + 0.5);
	ctx.stroke();
}

function drawVerticalGuidewire(x){
	ctx.beginpath();
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