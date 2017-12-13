import grid from './grid.js'

// Variables.................................................................................
	const cvs = document.getElementById('cvs');
	const ctx = cvs.getContext('2d');

	const AXIS_MARGIN = 40;
	const AXIS_ORIGIN = {
		x: AXIS_MARGIN,
		y: cvs.height - AXIS_MARGIN
	};
	const AXIS_TOP = AXIS_MARGIN;
	const AXIS_RIGHT = cvs.width - AXIS_MARGIN;
	const AXIS_WIDTH = AXIS_RIGHT - AXIS_ORIGIN.x;
	const AXIS_HEIGHT = AXIS_ORIGIN.y - AXIS_TOP;

	const HORIZONTAL_TICK_SPACING = 10;
	const VERTICAL_TICK_SPACING = 10;

	const NUM_HORIZONTAL_TICKS = AXIS_WIDTH / HORIZONTAL_TICK_SPACING;
	const NUM_VERTICAL_TICKS = AXIS_HEIGHT / VERTICAL_TICK_SPACING;

	const TICK_WIDTH = 10;
	const TICK_LINEWIDTH = .5;
	const TICK_COLOR = 'navy';

	const AXIS_LINEWIDTH = 1;
	const AXIS_COLOR = 'blue';

// Functions..................................................................................

	// 绘制坐标
	function drawAxes(){
		ctx.save();

		ctx.strokeStyle = AXIS_COLOR;
		ctx.lineWidth = AXIS_LINEWIDTH;
		drawHorizontalAxis();
		drawVerticalAxis();

		ctx.lineWidth = TICK_LINEWIDTH;
		ctx.strokeStyle = TICK_COLOR;
		drawHorizontalAxisTicks();
		drawVerticalAxisTicks();

		ctx.restore();
	}

	// 绘制横轴
	function drawHorizontalAxis(){
		ctx.beginPath();
		ctx.moveTo(AXIS_ORIGIN.x, AXIS_ORIGIN.y);
		ctx.lineTo(AXIS_RIGHT, AXIS_ORIGIN.y);
		ctx.stroke();
	}

	// 绘制纵轴
	function drawVerticalAxis(){
		ctx.beginPath();
		ctx.moveTo(AXIS_ORIGIN.x, AXIS_ORIGIN.y);
		ctx.lineTo(AXIS_ORIGIN.x, AXIS_TOP);
		ctx.stroke();
	}

	// 绘制横轴刻度
	function drawHorizontalAxisTicks(){
		let deltaY;

		for(let i = 0; i < NUM_HORIZONTAL_TICKS; ++i){
			deltaY = i % 5 === 0 ? TICK_WIDTH : TICK_WIDTH / 2;
			ctx.beginPath();
			ctx.moveTo(AXIS_ORIGIN.x + i * HORIZONTAL_TICK_SPACING, AXIS_ORIGIN.y - deltaY);
			ctx.lineTo(AXIS_ORIGIN.x + i * HORIZONTAL_TICK_SPACING, AXIS_ORIGIN.y + deltaY);
			ctx.stroke();
		}
	}

	// 绘制纵轴刻度
	function drawVerticalAxisTicks(){
		let deltaX;

		for(let i = 0; i < NUM_VERTICAL_TICKS; ++i){
			deltaX = i % 5 === 0 ? TICK_WIDTH : TICK_WIDTH / 2;
			ctx.beginPath();
			ctx.moveTo(AXIS_ORIGIN.x - deltaX, AXIS_ORIGIN.y - i * VERTICAL_TICK_SPACING);
			ctx.lineTo(AXIS_ORIGIN.x + deltaX, AXIS_ORIGIN.y - i * VERTICAL_TICK_SPACING);
			ctx.stroke();
		}
	}

// Initializtion.........................................................

	grid('lightgray', 10, 10);
	drawAxes();