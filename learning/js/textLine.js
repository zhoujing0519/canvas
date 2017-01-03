// Constructor..................................................

	function TextLine(x, y){
		this.text = "";
		this.left = x;
		this.bottom = y;
		this.caret = 0;
	}

// Prototype....................................................

	TextLine.prototype = {
		
		insert: function(text){
			this.text = this.text.substr(0, this.caret) + text + this.text.substr(this.caret);
			this.caret += text.length;
		},

		removeCharacterBeforeCaret: function(){
			if(this.caret === 0) return;

			// 这里是考虑到，从中间按下Backspace键，删除的情况。
			// 如果只是删除，后面的 + this.text.substring(this.caret)可以省略。
			this.text = this.text.substring(0, this.caret - 1) + this.text.substring(this.caret);

			this.caret--;
		},

		getWidth: function(ctx){
			return ctx.measureText(this.text).width;
		},

		getHeight: function(ctx){
			var h = ctx.measureText("W").width;
			return h + h / 6;
		},

		draw: function(ctx){
			ctx.save();

			ctx.textAlign = "start";
			ctx.textBaseline = "bottom";

			ctx.strokeText(this.text, this.left, this.bottom);
			ctx.fillText(this.text, this.left, this.bottom);

			ctx.restore();
		},

		erase: function(ctx, imageData){
			ctx.putImageData(imageData, 0, 0);
		}
	};