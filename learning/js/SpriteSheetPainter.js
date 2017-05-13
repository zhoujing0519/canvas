// Constructor.............................

	function SpriteSheetPainter(cells){
		this.cells = cells || [];
		this.cellIndex = 0;
	}

// Prototype...............................

	SpriteSheetPainter.prototype = {
		advance: function(){
			if(this.cellIndex == this.cells.length - 1){
				this.cellIndex = 0;
			}else{
				this.cellIndex++;
			}
		},

		paint: function(sprite, context){
			var cell = this.cells[this.cellIndex];

			context.drawImage(
				spritesheet, 
				cell.x, cell.y, cell.w, cell.h, 
				sprite.x, sprite.y, cell.w, cell.h
			);
		}
	};