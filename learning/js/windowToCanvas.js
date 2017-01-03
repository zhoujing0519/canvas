function windowToCanvas(x, y){
	var bbox = cvs.getBoundingClientRect();

	return {
		x: (x - bbox.left) * (cvs.width / bbox.width),
		y: (y - bbox.top) * (cvs.height / bbox.height)
	};
}