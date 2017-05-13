// Global.................................................................
	
	var canvas = document.getElementById('canvas'),
		context = canvas.getContext('2d'),

		linearRadio = document.getElementById('linearRadio'),
		easeInRadio = document.getElementById('easeInRadio'),
		easeOutRadio = document.getElementById('easeOutRadio'),
		easeInOutRadio = document.getElementById('easeInOutRadio'),

		animateButton = document.getElementById('animateButton'),

		spritesheet = new Image(),

		runnerCells = [

			{left: 0, top: 0, width: 47, height: 64},
			{left: 55, top: 0, width: 44, height: 64},
			{left: 107, top: 0, width: 39, height: 64},
			{left: 152, top: 0, width: 46, height: 64},
			{left: 208, top: 0, width: 49, height: 64},
			{left: 265, top: 0, width: 46, height: 64},
			{left: 320, top: 0, width: 42, height: 64},
			{left: 380, top: 0, width: 35, height: 64},
			{left: 425, top: 0, width: 35, height: 64}

		],

		interval,
		lastAdvance = 0.0,

		SPRITE_LEFT = canvas.width - runnerCells[0].width,
		SPRITE_TOP = 10,

		PAGEFLIP_INTERVAL = 100,
		ANIMATION_DURATION = 3900,

		animationTimer = new AnimationTimer(ANIMATION_DURATION, AnimationTimer.makeLinear(1)),

		LEFT = 1.5,
		RIGHT = canvas.width - runnerCells[0].width,
		BASELINE = canvas.height - 9.5,
		TICK_HEIGHT = 8.5,
		WIDTH = RIGHT - LEFT,

		runInPlace = {

			execute: function(){
				var elapsed = animationTimer.getElapsedTime();

				if(lastAdvance === 0){ // Skip first time
					lastAdvance = elapsed;
				}else if(lastAdvance !== 0 && elapsed - lastAdvance > PAGEFLIP_INTERVAL){
					sprite.painter.advance();
					lastAdvance = elapsed;
				}
			}

		},

		moveRightToLeft = {

			lastMove: 0,

			reset: function(){
				this.lastMove = 0;
			},

			execute: function(sprite, context, time){
				var elapsed = animationTimer.getElapsedTime(),
					advanceElapsed = elapsed - this.lastMove;

				if(this.lastMove === 0){ // Skip first time
					this.lastMove = elapsed;
				}else{
					sprite.left -= (advanceElapsed / 1000) * sprite.velocityX;
					this.lastMove = elapsed;
				}
			}

		},

		sprite = new Sprite(
			'runner',
			new SpriteSheetPainter(runnerCells),
			[moveRightToLeft, runInPlace]
		);

// Functions.................................................................

	function endAnimation(){
		animateButton.value = 'Animate';
		animateButton.style.display = 'inline';
		animationTimer.stop();
		lastAdvance = 0;
		sprite.painter.cellIndex = 0;
		sprite.left = SPRITE_LEFT;
		animationTimer.reset();
		moveRightToLeft.reset();
	}

	function startAnimation(){
		animationTimer.start();
		animateButton.style.display = 'none';
		window.requestNextAnimationFrame(animate);
	}

	function drawAxis(){
		context.lineWidth = 0.5;
		context.strokeStyle = 'cornflowerblue';
		context.moveTo(LEFT, BASELINE);
		context.lineTo(RIGHT, BASELINE);
		context.stroke();

		for(var i = 0; i <= WIDTH; i += WIDTH / 20){
			context.beginPath();
			context.moveTo(LEFT + i, BASELINE - TICK_HEIGHT);
			context.lineTo(LEFT + i, BASELINE + TICK_HEIGHT);
			context.stroke();
		}

		context.beginPath();
		context.moveTo(RIGHT, BASELINE - TICK_HEIGHT);
		context.lineTo(RIGHT, BASELINE + TICK_HEIGHT);
		context.stroke();
	}

	function drawTimeLine(){
		// var realElapsed = animationTimer.getRealElapsedTime(),
		// 	realPercent = realElapsed / ANIMATION_DURATION;

		var elapsed = animationTimer.getElapsedTime(),
			realPercent = elapsed / ANIMATION_DURATION;

		context.lineWidth = 0.5;
		context.strokeStyle = 'rgba(0, 0, 255, 0.5)';
		context.beginPath();
		context.moveTo(WIDTH - realPercent * WIDTH, 0);
		context.lineTo(WIDTH - realPercent * WIDTH, canvas.height);
		context.stroke();
	}

// Event handlers.................................................................

	animateButton.onclick = function(e){
		if(animateButton.value === 'Animate'){
			startAnimation();
		}else{
			endAnimation();
		}
	};

	linearRadio.onclick = function(e){
		animationTimer.timeWrap = AnimationTimer.makeLinear(1);
	};

	easeInRadio.onclick = function(e){
		animationTimer.timeWrap = AnimationTimer.makeEaseIn(1);
	};

	easeOutRadio.onclick = function(e){
		animationTimer.timeWrap = AnimationTimer.makeEaseOut(1);
	};

	easeInOutRadio.onclick = function(e){
		animationTimer.timeWrap = AnimationTimer.makeEaseInOut();
	};

// Animation......................................................................

	function animate(time){
		if(animationTimer.isRunning()){
			var elapsed = animationTimer.getElapsedTime();

			context.clearRect(0, 0, canvas.width, canvas.height);
			sprite.update(context, time);
			sprite.paint(context);
			
			drawTimeLine();
			drawAxis();

			if(animationTimer.isOver()){
				endAnimation();
			}

			window.requestNextAnimationFrame(animate);
		}
	}

// Initialization.................................................................

	// spritesheet.src = 'running-sprite-sheet.png';
	spritesheet.src = '../images/background.jpg';
	sprite.left = SPRITE_LEFT;
	sprite.top = SPRITE_TOP;
	sprite.velocityX = 100; // px/s

	drawAxis();
	spritesheet.onload = function(e){
		sprite.paint(context);
	};