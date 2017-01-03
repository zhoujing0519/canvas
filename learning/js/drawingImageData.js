// Save and restore drawing surface
function saveDrawingSurface(){
	drawingSurfaceImageData = ctx.getImageData(0, 0, cvs.width, cvs.height);
}

function restoreDrawingSurface(){
	ctx.putImageData(drawingSurfaceImageData, 0, 0);
}