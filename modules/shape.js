export default {
	// 带有方向的矩形路径
	rect(ctx, x, y, w, h, direction){
		ctx.moveTo(x, y);
		if(direction){ // 逆时针
			ctx.lineTo(x, y+h);
			ctx.lineTo(x+w, y+h);
			ctx.lineTo(x+w, y);
		}else{ // 顺时针
			ctx.lineTo(x+w, y);
			ctx.lineTo(x+w, y+h);
			ctx.lineTo(x, y+h);
		}
		ctx.closePath();
	},
}