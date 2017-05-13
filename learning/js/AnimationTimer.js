// Global................................................................

	var DEFAULT_ELASTIC_PASSES = 3;

// Constructor...........................................................
	
	function AnimationTimer(duration, timeWrap){
		if(timeWrap !== undefined) this.timeWrap = timeWrap;
		if(duration !== undefined) this.duration = duration;
		this.stopWatch = new StopWatch();
 	}

// Prototype.............................................................

	AnimationTimer.prototype = {

		start: function(){
			this.stopWatch.start();
		},

		stop: function(){
			this.stopWatch.stop();
		},

		getElapsedTime: function(){
			var elapsedTime = this.stopWatch.getElapsedTime(),
				percentComplete = elapsedTime / this.duration;

			if(!this.stopWatch.running) return undefined;
			if(this.timeWrap == undefined) return elapsedTime;

			return elapsedTime * (this.timeWrap(percentComplete) / percentComplete);
		},

		isRunning: function(){
			return this.stopWatch.isRunning;
		},

		isOver: function(){
			return this.stopWatch.getElapsedTime() > this.duration;
		},

		reset: function(){
			return this.stopWatch.reset;
		}

	};

// Functions..............................................................

	AnimationTimer.makeEaseIn = function(strength){
		return function(percentComplete){
			return Math.pow(percentComplete, strength * 2);
		};
	};

	AnimationTimer.makeEaseOut = function(strength){
		return function(percentComplete){
			return 1 - Math.pow(1 - percentComplete, strength * 2);
		};
	};

	AnimationTimer.makeEaseInOut = function(){
		return function(percentComplete){
			return percentComplete - Math.sin(percentComplete * 2 * Math.PI) / (2 * Math.PI);
		};
	};

	AnimationTimer.makeElastic = function(passes){
		passes = passes || DEFAULT_ELASTIC_PASSES;

		return function(percentComplete){
			return ((1 - Math.cos(percentComplete * Math.PI * passes)) * (1 - percentComplete)) + percentComplete;
		};
	};

	AnimationTimer.makeBounce = function(bounces){
		var fn = AnimationTimer.makeElastic(bounces);

		return function(percentComplete){
			percentComplete = fn(percentComplete);

			return percentComplete <= 1 ? percentComplete : 2 - percentComplete;
		};
	};

	AnimationTimer.makeLinear = function(){
		return function(percentComplete){
			return percentComplete;
		};
	};