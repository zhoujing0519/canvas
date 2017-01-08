var erasure = function (obj) {
    var elem_canvas = obj.elem;
    var img_src = obj.img_src;
    var line_width = obj.line_width;
    var canvas = document.getElementById(elem_canvas), 
        ctx = canvas.getContext("2d");
    var x1, y1, a = line_width, timeout, totimes = 100, jiange = 30;
    //canvas.width = document.getElementById("bb").clientWidth;
    //canvas.height = document.getElementById("bb").clientHeight;
    var img = new Image();
        img.src = img_src;

    this.init = function () {

        img.onload = function () {

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            otherClip();
        }
    }
    this.clearDraw = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //tapClip()
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        siteinfo.touch_xy.xy = [];
    }

//使用clip来达到擦除效果
    function otherClip() {
        var hastouch = "ontouchstart" in window ? true : false,
            tapstart = hastouch ? "touchstart" : "mousedown",
            tapmove = hastouch ? "touchmove" : "mousemove",
            tapend = hastouch ? "touchend" : "mouseup";

        canvas.addEventListener(tapstart, function (e) {
            e.preventDefault();

            // 设置起始坐标x1,y1
            x1 = hastouch ? e.targetTouches[0].pageX : e.clientX - canvas.offsetLeft;
            y1 = hastouch ? e.targetTouches[0].pageY : e.clientY - canvas.offsetTop;
            var touchXY = [x1, y1, 0];
            
            siteinfo.touch_xy.xy.push(touchXY);

            // 使用clip来达到擦除效果
            ctx.save()
            ctx.beginPath()
            ctx.arc(x1, y1, a, 0, 2 * Math.PI);
            ctx.clip()
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.restore();

            canvas.addEventListener(tapmove, tapmoveHandler);
            canvas.addEventListener(tapend, function(){
                canvas.removeEventListener(tapmove, tapmoveHandler);
            });

            var touchXY_move = [];

            function tapmoveHandler(e) {
                e.preventDefault();
                // 获取移动坐标x2,y2
                x2 = hastouch ? e.targetTouches[0].pageX : e.clientX - canvas.offsetLeft;
                y2 = hastouch ? e.targetTouches[0].pageY : e.clientY - canvas.offsetTop;
                touchXY_move = [x2, y2, 1];
                siteinfo.touch_xy.xy.push(touchXY_move);

                var asin = a * Math.sin(Math.atan((y2 - y1) / (x2 - x1)));
                var acos = a * Math.cos(Math.atan((y2 - y1) / (x2 - x1)));
                var x3 = x1 + asin;
                var y3 = y1 - acos;
                var x4 = x1 - asin;
                var y4 = y1 + acos;
                var x5 = x2 + asin;
                var y5 = y2 - acos;
                var x6 = x2 - asin;
                var y6 = y2 + acos;

                ctx.save();
                ctx.beginPath();
                ctx.arc(x2, y2, a, 0, 2 * Math.PI);
                ctx.clip();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.restore();

                // 画出圆的移动轨迹
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(x3, y3);
                ctx.lineTo(x5, y5);
                ctx.lineTo(x6, y6);
                ctx.lineTo(x4, y4);
                ctx.closePath();
                ctx.clip();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.restore();

                x1 = x2;
                y1 = y2;
            }
        })
    }
}


function CanvasDoodle(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.imgSrc = canvas.getAttribute("imgsrc");
    this.width = canvas.width;
    this.height = canvas.height;
    this.touch_xy = siteinfo.work_touch_xy.xy;
    //this.init();
}

CanvasDoodle.prototype = {
    init: function (fc) {
        var _self = this;

        var img = new Image();
        img.src = this.imgSrc;
        img.onload = function () {
            var pat = _self.ctx.createPattern(img, "no-repeat");
            _self.ctx.strokeStyle = pat;
            _self.ctx.lineCap = "round";
            _self.ctx.lineJoin = "round";
            _self.ctx.lineWidth = 20;
            if (fc) {
                fc();
            }

        }

    },
    draw: function (i) {
        var _self = this;

        /*if (_self.touch_xy[i - 1][2] == 0) {
            _self.ctx.beginPath();
            _self.ctx.moveTo(_self.touch_xy[i - 1][0], _self.touch_xy[i - 1][1]);
            var sx1=parseInt(_self.touch_xy[i-1][0])+0.01;
            var sy1=parseInt(_self.touch_xy[i-1][1])+0.01;
            _self.ctx.lineTo(sx1, sy1);
            _self.ctx.stroke();
            _self.ctx.beginPath();
            _self.ctx.moveTo(sx1, sy1);

        }*/
        if (_self.touch_xy[i][2] == 0) {
            _self.ctx.beginPath();
            _self.ctx.moveTo(_self.touch_xy[i][0], _self.touch_xy[i][1]);
            var sx1=parseInt(_self.touch_xy[i][0])+0.01;
            var sy1=parseInt(_self.touch_xy[i][1])+0.01;
            _self.ctx.lineTo(sx1, sy1);
            _self.ctx.stroke();
            _self.ctx.beginPath();
            _self.ctx.moveTo(sx1, sy1);

        }
        if (_self.touch_xy[i][2] == 1) {
            _self.ctx.lineTo(_self.touch_xy[i][0], _self.touch_xy[i][1]);
            _self.ctx.stroke();
        }
    },
    runDraw: function (fc) {
        var _self = this;
        var i = 0;
        //alert(_self.touch_xy.length)
        var timer_canvas = setInterval(function () {

            //alert(i)

            if (i >= _self.touch_xy.length) {
                //alert("out")
                clearInterval(timer_canvas);
                if (fc) {
                    fc()
                }
            }
            else{
                _self.draw(i);
                i++;


            }
        }, 30);

    },
    runDraw2: function (fc) {
        var _self = this;

         for (var i = 1; i < _self.touch_xy.length; i++) {

             _self.draw(i);

         }
         if (fc) {
         fc()
         }
    }
};

		
		
		
