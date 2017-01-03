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