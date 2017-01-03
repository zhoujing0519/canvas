// Constructor................................................................

function Paragraph(ctx, left, top, imageData, cursor){
	this.ctx = ctx;
	this.drawingSurface = imageData;
	this.left = left;
	this.top = top;
	this.lines = [];
	this.activeLine = undefined;
	this.cursor = cursor;
	this.blinkInterval = undefined;
}

// Prototype...................................................................

Paragraph.prototype = {

	isPointInside: function(loc){
		var ctx = this.ctx;

		ctx.beginPath();
		ctx.rect(this.left, this.top, this.getWidth(), this.getHeight());

		return ctx.isPointInPath(loc.x, loc.y);
	},

	getWidth: function(){
		var w = 0,
			widest = 0;

		this.lines.forEach(function(line){
			w = line.getWidth(this.ctx);

			if(w > widest){
				widest = w;
			}

		});

		return widest;
	},

	getHeight: function(){
		var h = 0;

		this.lines.forEach(function(line){
			h += line.getHeight(this.ctx);
		});

		return h;
	},

	draw: function(){
		this.lines.forEach(function(line){
			line.draw(this.ctx);
		});
	},

	erase: function(ctx, imageData){
		ctx.putImageData(imageData, 0, 0);
	},

	addLine: function(line){
		this.lines.push(line);
		this.activeLine = line;
		this.moveCursor(line.left, line.bottom);
	},

	insert: function(text){
		this.erase(this.ctx, this.drawingSurface);
		this.activeLine.insert(text);

		var txt = this.activeLine.text.substring(0, this.activeLine.caret),
			w = this.ctx.measureText(txt).width;

		this.moveCursor(this.activeLine.left + w, this.activeLine.bottom);
		this.draw();
	},

	blinkCursor: function(x, y){
		var self = this,
			BLINK_OUT = 200,
			BLINK_INTERVAL = 900;

		this.blinkInterval = setInterval(function(e){
			cursor.erase(self.ctx, self.drawingSurface);

			setTimeout(function(e){
				cursor.draw(self.ctx, cursor.left, cursor.top + cursor.getHeight(self.ctx));
			}, BLINK_OUT);

		}, BLINK_INTERVAL);
	},

	moveCursorCloseTo: function(x, y){
		var line = this.getLine(y);

		if(line){

			line.caret = this.getColumn(line, x);
			this.activeLine = line;
			this.moveCursor(line.getCaretX(this.ctx), line.bottom);

		}
	},

	moveCursor: function(x, y){
		this.cursor.erase(this.ctx, this.drawingSurface);
		this.cursor.draw(this.ctx, x, y);

		// var self = this;

		// clearInterval(self.blinkInterval);
		// this.blinkCursor(x, y);

		if(!this.blinkInterval){
			this.blinkCursor(x, y);
		}
	},

	moveLinesDown: function(start){
		for(var i = start; i < this.lines.length; ++i){
			line = this.lines[i];
			line.bottom += line.getHeight(this.ctx);
		}
	},

	newLine: function(){
		var textBeforeCursor = this.activeLine.text.substring(0, this.activeLine.caret),
			textAfterCursor = this.activeLine.text.substring(this.activeLine.caret),

			height = this.ctx.measureText("W").width + this.ctx.measureText("W").width / 6,

			bottom = this.activeLine.bottom + height,

			activeIndex,line;

		// Erase paragraph and set active line's text

		this.erase(this.ctx, this.drawingSurface);
		this.activeLine.text = textBeforeCursor;

		// Create a new line that contains the text after the cursor

		line = new TextLine(this.activeLine.left, bottom);
		line.insert(textAfterCursor);

		// Splice in new line, set active line, and reset caret

		activeIndex = this.lines.indexOf(this.activeLine);
		this.lines.splice(activeIndex + 1, 0, line);

		this.activeLine = line;
		this.activeLine.caret = 0;

		// Starting at the new line, loop over remaining lines

		activeIndex = this.lines.indexOf(this.activeLine);

		for(var i = activeIndex + 1; i < this.lines.length; ++i){
			line = this.lines[i];
			line.bottom += height; // Move line down one row
		}

		this.draw();
		this.cursor.draw(this.ctx, this.activeLine.left, this.activeLine.bottom);
	},

	getLine: function(y){
		var line;

		for(var i = 0; i < this.lines.length; ++i){
			line = this.lines[i];

			if(y > line.bottom - line.getHeight(this.ctx) && y < line.bottom){
				return line;
			}
		}

		return undefined;
	},

	getColumn: function(line, x){
		var found = false,
			before,
			after,
			closest,
			tmpLine,
			column;

		tmpLine = new TextLine(line.left, line.bottom);
		tmpLine.insert(line.text);

		while(!found && tmpLine.text.length > 0){
			before = tmpLine.left + tmpLine.getWidth(this.ctx);
			tmpLine.removeLastCharacter();
			after = tmpLine.left + tmpLine.getWidth(this.ctx);

			if(after < x){
				closest = x - after < before - x ? after : before;
				column = closest === before ? tmpLine.text.length + 1 : tmpLine.text.length;
				found = true;
			}
		}

		return column;
	},

	activeLineOutOfText: function(){
		return this.activeLine.text.length === 0;
	},

	activeLineIsTopLine: function(){
		return this.lines[0] === this.activeLine;
	},

	moveUpOneLine: function(){
		var lastActiveText, line, before, after,
			lastActiveLine = this.activeLine,
			activeIndex = this.lines.indexOf(this.activeLine);
		
		lastActiveText = "" + lastActiveLine.text;

		this.activeLine = this.lines[activeIndex - 1];
		this.activeLine.caret = this.activeLine.text.length;

		this.lines.splice(activeIndex, 1);

		this.moveCursor(this.activeLine.left + this.activeLine.getWidth(this.ctx), this.activeLine.bottom);

		this.activeLine.text += lastActiveText;

		for(var i = activeIndex; i < this.lines.length; ++i){
			line = this.lines[i];
			line.bottom -= line.getHeight(this.ctx);
		}
	},

	backspace: function(){
		var lastActiveLine, activeIndex, txt, w;

		this.ctx.save();

		if(this.activeLine.caret === 0){
			if(!this.activeLineIsTopLine()){
				this.erase(this.ctx, this.drawingSurface);
				this.moveUpOneLine();
				this.draw();
			}
		}
		// Active line has text
		else{
			this.ctx.fillStyle = fillStyleSelect.value;
			this.ctx.strokeStyle = strokeStyleSelect.value;

			this.erase(this.ctx, this.drawingSurface);
			this.activeLine.removeCharacterBeforeCaret();

			txt = this.activeLine.text.splice(0, this.activeLine.caret);
			w = this.ctx.measureText(txt).width;

			this.moveCursor(this.activeLine.left + w, this.activeLine.bottom);
			this.draw(this.ctx);

			this.ctx.restore();
		}
	},
};