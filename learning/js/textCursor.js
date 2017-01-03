function TextCursor(width, fillStyle){
	this.fillStyle = fillStyle || "rgba(0, 0, 0, 0.5)";
	this.width = width || 2;
	this.left = 0;
	this.top = 0;
}

TextCursor.prototype = {
	
	getHeight: function(ctx){
		var h = ctx.measureText("M").width;
		return h + h / 6;
	},

	createPath: function(ctx){
		ctx.beginPath();
		ctx.rect(this.left, this.top, this.width, this.getHeight(ctx));
	},

	draw: function(ctx, left, bottom){
		ctx.save();

		this.left = left;
		this.top = bottom - this.getHeight(ctx);

		this.createPath(ctx);

		ctx.fillStyle = this.fillStyle;
		ctx.fill();

		ctx.restore();
	},

	erase: function(ctx, imageData){
		ctx.putImageData(imageData, 0, 0, this.left, this.top, this.width, this.getHeight(ctx));
	}
};